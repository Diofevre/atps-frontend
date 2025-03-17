/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, Search, Type, Bookmark, Layout, MessageSquare, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import type { ContentItem, LessonPage, ImageItem } from '@/lib/type';
import { useSearchParams } from 'next/navigation';
import LessonChat from '../../../_components/LessonChat';
import { useAuth } from '@clerk/nextjs';

export default function LessonViewerPage({
	params,
}: {
	params: {
    topicLessonId: string;
    lessonId: string;
    pageId: string;
	};
}) {
  const { getToken } = useAuth();
	const searchParams = useSearchParams();
	const debutPageFromUrl = searchParams.get('debutPage');
	const initialPageNumber = debutPageFromUrl ? parseInt(debutPageFromUrl, 10) : 1;

	const [currentPage, setCurrentPage] = useState<LessonPage | null>(null);
	const [currentPageNumber, setCurrentPageNumber] = useState(initialPageNumber);
	const [isLoadingPage, setIsLoadingPage] = useState(false);
	const [viewMode, setViewMode] = useState<'overview' | 'ai'>('overview');
	const [lessonNotFound, setLessonNotFound] = useState(false);
	const [isBookmarked, setIsBookmarked] = useState(false);

	const fetchLessonPage = useCallback(async (pageNumber: number) => {
		setIsLoadingPage(true);
		setLessonNotFound(false);
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/lessons/pages/${params.topicLessonId}/${params.lessonId}/${pageNumber}`
			);

			if (!response.ok) {
				if (response.status === 404) {
					setLessonNotFound(true);
				} else {
					throw new Error('Failed to fetch lesson page');
				}
			} else {
				const data = await response.json();
				setCurrentPage(data);
			}
		} catch (error) {
			console.error('Error fetching lesson page:', error);
			setCurrentPage(null);
		} finally {
			setIsLoadingPage(false);
		}
	}, [params.topicLessonId, params.lessonId]);

	// TODO API not available for now
	useEffect(() => {
		const checkBookmarkStatus = async () => {
			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookmarks/${params.pageId}`);
				if (response.ok) {
					const data = await response.json();
					setIsBookmarked(data.isBookmarked);
				}
			} catch (error) {
				console.error('Erreur lors de la vérification du marque-page:', error);
			}
		};

		checkBookmarkStatus();
	}, [params.pageId]);

	// Gérer le basculement du marque-page
	const handleBookmarkToggle = async () => {
    const token = await getToken();
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookmarks`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
				},
				body: JSON.stringify({
					page_id: parseInt(params.pageId, 10),
				}),
			});

			if (response.ok) {
				setIsBookmarked(!isBookmarked);
			}
		} catch (error) {
			console.error('Erreur lors du marquage de la page:', error);
		}
	};

	useEffect(() => {
		fetchLessonPage(currentPageNumber);
	}, [currentPageNumber, fetchLessonPage]);

	const handlePageChange = useCallback(async (direction: 'prev' | 'next') => {
		if (!currentPage?.fin_page) return;

		const newPageNumber = direction === 'next'
			? currentPageNumber + 1
			: currentPageNumber - 1;

		if (newPageNumber >= 1 && newPageNumber <= currentPage.fin_page) {
			setCurrentPageNumber(newPageNumber);
		}
	}, [currentPageNumber, currentPage?.fin_page]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'ArrowLeft' && currentPageNumber > 1 && !isLoadingPage) {
				handlePageChange('prev');
			} else if (event.key === 'ArrowRight' && !isLoadingPage && currentPage?.fin_page && currentPageNumber < currentPage.fin_page) {
				handlePageChange('next');
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [currentPageNumber, handlePageChange, isLoadingPage, currentPage?.fin_page]);

	const renderContentItem = (item: ContentItem) => {
		const typeStyles = {
			title: "text-3xl font-bold text-primary mb-8",
			subtitle: "text-2xl font-semibold text-primary mb-6",
			figure_title: "text-sm font-medium text-muted-foreground mb-2",
			paragraph: "text-base mb-6",
		};

		const className = typeStyles[item.type as keyof typeof typeStyles] || "text-base mb-4";

		return (
			<div
				key={item.text}
				className={`${className} ${item.type === 'paragraph' ? 'space-y-2' : ''}`}
			>
				{item.sub_items.map((subItem, index) => {
					const color = subItem.color === -1
						? 'inherit'
						: `#${(subItem.color >>> 0).toString(16).slice(2)}`;

					const isListItem = subItem.text.trim().startsWith('•');

					return (
						<div
							key={`${subItem.text}-${index}`}
							className={`
				text-foreground transition-colors hover:text-primary
				${isListItem ? 'pl-6 -indent-4' : ''}
				${item.type === 'title' ? 'leading-tight' : 'leading-relaxed'}
			`}
							style={{
								color,
								fontSize: `${subItem.font_size}px`,
							}}
						>
							{subItem.text}
						</div>
					);
				})}
			</div>
		);
	};

	const renderImageItem = (image: ImageItem) => {
		return (
			<div
				key={image.image_filename}
				className="w-full rounded-lg overflow-hidden bg-gray-50 mb-6"
			>
				<img
					src={image.image_filename}
					alt={`Page ${currentPageNumber} content`}
					className="w-full h-auto object-contain mx-auto"
					style={{
						maxHeight: '600px',
					}}
				/>
			</div>
		);
	};

	const renderContent = () => {
		if (!currentPage) return null;

		const contentsByType = currentPage.contents.reduce((acc: { [key: string]: ContentItem[] }, item) => {
			if (!acc[item.type]) {
				acc[item.type] = [];
			}
			acc[item.type].push(item);
			return acc;
		}, {});

		return (
			<div className="space-y-6">
				{contentsByType.title?.map(renderContentItem)}
				{currentPage.images?.map(renderImageItem)}
				{contentsByType.figure_title?.map(renderContentItem)}
				{contentsByType.subtitle?.map(renderContentItem)}
				{contentsByType.paragraph?.map(renderContentItem)}
				{Object.entries(contentsByType).map(([type, items]) => {
					if (!['title', 'figure_title', 'subtitle', 'paragraph'].includes(type)) {
						return items.map(renderContentItem);
					}
					return null;
				})}
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-background flex flex-col">
			<header className="border-b fixed top-0 left-0 right-0 bg-background z-50">
				<div className="container mx-auto px-4 h-14 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Type className="h-5 w-5" />
						<Search className="h-5 w-5 hidden sm:block" />
						<button
							onClick={handleBookmarkToggle}
							className={`transition-colors duration-200 hidden sm:block ${
								isBookmarked ? 'text-blue-500' : 'text-gray-500 hover:text-gray-700'
							}`}
							title={isBookmarked ? 'Retirer le marque-page' : 'Ajouter un marque-page'}
						>
							<Bookmark className="h-5 w-5" />
						</button>
					</div>

					<div className="font-medium">
						{currentPageNumber} / {currentPage?.fin_page ?? '...'}
					</div>

					<Link
						href="/courses/manuals"
						className="hover:text-primary/20 text-primary/20 transition-colors bg-white p-1 rounded-full border border-primary/20 hover:bg-primary/10"
					>
						<X className="h-3 w-3" />
					</Link>
				</div>
			</header>

			<main className={`flex-1 container mx-auto px-4 py-8 mt-14 mb-16 ${
				viewMode === 'ai' ? 'lg:grid lg:grid-cols-2 lg:gap-8' : ''
			}`}>
				<div className={`${viewMode === 'ai' ? 'w-full' : 'max-w-3xl mx-auto'}`}>
					{isLoadingPage ? (
						<div className="flex justify-center items-center min-h-[600px]">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
						</div>
					) : lessonNotFound ? (
					<Alert>
						<AlertDescription>
							No lesson found for this topic and lesson ID.
						</AlertDescription>
					</Alert>
					) : currentPage ? (
						<div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
							<div className="prose prose-lg max-w-none">
								{renderContent()}
							</div>
						</div>
					) : (
						<Alert>
							<AlertDescription>
								Failed to load lesson content. Please try again.
							</AlertDescription>
						</Alert>
					)}
				</div>

				{viewMode === 'ai' && (
				  <div className="w-full h-[calc(100vh-8rem)]">
					<LessonChat pageId={parseInt(params.pageId, 10)} />
				  </div>
				)}
			</main>

			<footer className="border-t fixed bottom-0 left-0 right-0 bg-background">
				<div className="container mx-auto px-4 h-16">
					<div className="flex items-center justify-between h-full">
						<div className="flex bg-secondary rounded-lg p-1 items-center gap-1">
							<button
								onClick={() => setViewMode('overview')}
								className={`flex items-center px-3 py-2 rounded-lg justify-center ${
									viewMode === 'overview' ? 'bg-[#EECE84]' : 'hover:bg-muted'
								}`}
							>
								<Layout className="h-4 w-4 mr-2" />
								<span className="text-sm font-medium hidden sm:inline">Overview</span>
							</button>

							<button
								onClick={() => setViewMode('ai')}
								className={`flex items-center px-3 py-2 rounded-lg justify-center ${
									viewMode === 'ai' ? 'bg-[#EECE84]' : 'hover:bg-muted'
								}`}
							>
								<MessageSquare className="h-4 w-4 mr-2" />
								<span className="text-sm font-medium hidden sm:inline">AI</span>
							</button>
						</div>

						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								onClick={() => handlePageChange('prev')}
								disabled={currentPageNumber <= 1 || isLoadingPage}
								size="icon"
								className="w-10 h-10"
							>
								<ChevronLeft className="h-5 w-5" />
							</Button>
							<Button
								variant="ghost"
								onClick={() => handlePageChange('next')}
								disabled={!currentPage?.fin_page || currentPageNumber >= currentPage.fin_page || isLoadingPage}
								size="icon"
								className="w-10 h-10"
							>
								<ChevronRight className="h-5 w-5" />
							</Button>
						</div>

						<Button
							variant="ghost"
							size="icon"
							className="text-rose-500 hover:text-rose-600 hover:bg-rose-50"
						>
							<AlertCircle className="h-5 w-5" />
						</Button>
					</div>
				</div>
			</footer>
		</div>
	);
}
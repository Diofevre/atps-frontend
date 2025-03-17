'use client'

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Plus, Pencil, ChevronDown, BookOpen, Check } from 'lucide-react';
import { Chapter, ChapterFormData, Topic, SubChapter, SubChapterFormData } from '@/lib/type';
import { toast } from 'sonner';
import ChapterForm from './_components/form';
import SubChapterForm from '../subchapters/_components/form';
import { motion } from 'framer-motion';

type SubChapterState = {
  [chapterId: number]: SubChapter[] | undefined;
};

const ContentManagement = () => {
	const [topics, setTopics] = useState<Topic[]>([]);
	const [chapters, setChapters] = useState<Chapter[]>([]);
	const [subChapters, setSubChapters] = useState<SubChapterState>({});
	const [openDropdown, setOpenDropdown] = useState<number | null>(null);
	const [loadingSubChapters, setLoadingSubChapters] = useState<Record<number, boolean>>({});

	const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
	const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);

	const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
	const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);

	const [isSubChapterModalOpen, setIsSubChapterModalOpen] = useState(false);
	const [editingSubChapter, setEditingSubChapter] = useState<SubChapter | null>(null);

	const [isLoading, setIsLoading] = useState(false);
	const [editingTopicId, setEditingTopicId] = useState<number | null>(null);
	const [topicName, setTopicName] = useState('');

	const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false); 
	const [newTopicName, setNewTopicName] = useState('');


	const fetchData = useCallback(async () => {
		setIsLoading(true);
		try {
			const topicsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/topics`);
			setTopics(topicsResponse.data.topics);

			const chaptersResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/chapters`);

			if (selectedTopicId) {
				const filteredChapters = chaptersResponse.data.data.filter((chapter: Chapter) => chapter.topic_id === selectedTopicId);
				setChapters(filteredChapters);
			} else {
				setChapters(chaptersResponse.data.data);
			}

		} catch (error) {
			console.error("Error fetching topics and chapters:", error);
			toast.error('Failed to fetch data');
		} finally {
			setIsLoading(false);
		}
	}, [selectedTopicId]);

	const fetchSubChapters = useCallback(async (chapterId: number) => {
		setLoadingSubChapters(prev => ({ ...prev, [chapterId]: true }));
		try {
			const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/subchapters?chapter_id=${chapterId}`);
			const subChaptersData = response.data.data.filter((subChapter: SubChapter) => subChapter.chapter_id === chapterId);
			setSubChapters(prev => ({ ...prev, [chapterId]: subChaptersData }));
		} catch (error) {
			console.error(`Error fetching subchapters for chapter ${chapterId}:`, error);
			toast.error('Failed to fetch subchapters');
		} finally {
			setLoadingSubChapters(prev => ({ ...prev, [chapterId]: false }));
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const toggleDropdown = async (chapterId: number) => {
		if (openDropdown === chapterId) {
			setOpenDropdown(null);
		} else {
			setOpenDropdown(chapterId);
			if (!subChapters[chapterId]) {
				await fetchSubChapters(chapterId);
			}
		}
	};

	const handleStartEditTopic = (topic: Topic) => {
		setEditingTopicId(topic.id);
		setTopicName(topic.topic_name);
	};

	const handleCancelEditTopic = () => {
		setEditingTopicId(null);
		setTopicName('');
	};

	const handleUpdateTopic = async (topicId: number) => {
		try {
			await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/topics/${topicId}`, {
				topic_name: topicName
			});
			fetchData();
			handleCancelEditTopic();
			toast.success('Topic updated successfully');
		} catch (error) {
			console.error(error);
			toast.error('Failed to update topic');
		}
	};

	const handleCreateChapter = async (data: ChapterFormData) => {
		try {
			await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/chapters`, data);
			setIsChapterModalOpen(false);
			fetchData();
			toast.success('Chapter created successfully');
		} catch (error) {
			console.error(error);
			toast.error('Failed to create chapter');
		}
	};

	const handleUpdateChapter = async (data: ChapterFormData) => {
		if (!editingChapter) return;
		try {
			await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/chapters/${editingChapter.id}`, data);
			setIsChapterModalOpen(false);
			setEditingChapter(null);
			fetchData();
			toast.success('Chapter updated successfully');
		} catch (error) {
			console.error(error);
			toast.error('Failed to update chapter');
		}
	};

	const handleAddSubChapterClick = (chapterId: number) => {
		setSelectedChapterId(chapterId);
		setIsSubChapterModalOpen(true);
	};

	const handleCreateSubChapter = async (data: SubChapterFormData) => {
		try {
			await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/subchapters`, {
				...data,
				chapter_id: selectedChapterId
			});
			setIsSubChapterModalOpen(false);
			if (selectedChapterId) {
				await fetchSubChapters(selectedChapterId);
			}
			toast.success('SubChapter created successfully');
		} catch (error) {
			console.error(error);
			toast.error('Failed to create subchapter');
		}
	};

	const handleUpdateSubChapter = async (data: SubChapterFormData) => {
		if (!editingSubChapter || !selectedChapterId) return;
		try {
			await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/subchapters/${editingSubChapter.id}`, {
				...data,
				chapter_id: selectedChapterId
			});
			setIsSubChapterModalOpen(false);
			setEditingSubChapter(null);
			await fetchSubChapters(selectedChapterId);
			toast.success('SubChapter updated successfully');
		} catch (error) {
			console.error(error);
			toast.error('Failed to update subchapter');
		}
	};

	// New function to handle creating a new topic
	const handleCreateTopic = async () => {
		try {
			// Send a POST request to create the topic with default values
			await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/topics`, {
				topic_name: newTopicName,
				exam_number_question: 0,
				exam_duration: '01:30:00',
			});

			// Close the modal, refresh the data, and display a success message
			setIsAddTopicModalOpen(false);
			setNewTopicName('');
			await fetchData();
			toast.success('Topic created successfully');

		} catch (error) {
			console.error(error);
			toast.error('Failed to create topic');
		}
	};

  const inputClassName = "mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-[12px] text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed";

	return (
		<div className="min-h-screen">
			{/* Main Content */}
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex flex-col lg:flex-row gap-8">
					{/* Left Sidebar - Topics */}
					<div className="w-full lg:w-[450px] flex-shrink-0">
						<div className="bg-white rounded-xl shadow-md p-4">
							{/* Topics Header */}
							<div className="flex items-center justify-between mb-4">
								<h2 className="font-semibold text-gray-900">Topics</h2>
								<button
									onClick={() => setIsAddTopicModalOpen(true)}
									className="flex items-center gap-2 px-4 py-2 bg-[#EECE84] text-black rounded-lg hover:bg-[#EECE84]/90 transition-colors"
								>
									<Plus className="w-4 h-4" />
									<span className="text-sm font-semibold">Add Topic</span>
								</button>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
								{topics.map((topic) => (
									<div key={topic.id} className="relative">
										{editingTopicId === topic.id ? (
											<div className="flex items-center gap-2">
												<input
													type="text"
													value={topicName}
													onChange={(e) => setTopicName(e.target.value)}
													className="flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#EECE84] focus:border-transparent"
												/>
												<div className="flex gap-1">
													<button
														onClick={() => handleUpdateTopic(topic.id)}
														className="p-1 text-green-600 hover:bg-green-50 rounded"
													>
														<Check className="w-4 h-4" />
													</button>
													<button
														onClick={handleCancelEditTopic}
														className="p-1 text-red-600 hover:bg-red-50 rounded"
													>
														×
													</button>
												</div>
											</div>
										) : (
											<button
												onClick={() => {
													setSelectedTopicId(topic.id);
													setSelectedChapterId(null);
												}}
												className={`w-full group flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${selectedTopicId === topic.id ? 'bg-[#EECE84] text-black' : 'hover:bg-gray-100'
													}`}
											>
												<div className="flex items-center gap-2">
													<BookOpen className="w-4 h-4" />
													<span className="text-sm font-medium">{topic.topic_name}</span>
												</div>
												<Pencil
													onClick={(e) => {
														e.stopPropagation();
														handleStartEditTopic(topic);
													}}
													className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${selectedTopicId === topic.id ? 'opacity-100' : ''
														}`}
												/>
											</button>
										)}
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Right Content - Chapters and SubChapters */}
					<div className="flex-1 min-w-0">
						{isLoading ? (
							<div className="flex h-64 items-center justify-center">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EECE84]" />
							</div>
						) : selectedTopicId ? (
							<div className="space-y-6">
								<div className="flex justify-between items-center">
									<h2 className="text-lg font-semibold text-gray-900">
										Chapters
									</h2>
									<button
										onClick={() => setIsChapterModalOpen(true)}
										className="flex items-center gap-2 px-4 py-2 bg-[#EECE84] text-black rounded-lg hover:bg-[#EECE84]/90 transition-colors"
									>
										<Plus className="w-4 h-4" />
										<span className="text-sm font-semibold">Add Chapter</span>
									</button>
								</div>

								<div className="space-y-4">
									{chapters.map((chapter) => (
										<div key={chapter.id} className="bg-white rounded-xl shadow-md overflow-hidden">
											<div
												className="px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
												onClick={() => toggleDropdown(chapter.id)}
											>
												<div className="flex items-center justify-between">
													<span className="font-medium">{chapter.chapter_text}</span>
													<div className="flex items-center gap-2">
														<button
															onClick={(e) => {
																e.stopPropagation();
																setEditingChapter(chapter);
																setIsChapterModalOpen(true);
															}}
															className="p-1 hover:bg-gray-100 rounded transition-colors"
														>
															<Pencil className="w-4 h-4" />
														</button>
														<ChevronDown
															className={`w-4 h-4 transform transition-transform ${openDropdown === chapter.id ? 'rotate-180' : ''
																}`}
														/>
													</div>
												</div>
											</div>

											<motion.div
												initial={{ height: 0 }}
												animate={{ height: openDropdown === chapter.id ? 'auto' : 0 }}
												transition={{ duration: 0.2 }}
												className="overflow-hidden border-t"
											>
												<div className="p-4 bg-gray-50">
													<div className="flex justify-between items-center mb-3">
														<span className="text-sm font-medium text-gray-700">SubChapters</span>
														<button
															onClick={() => handleAddSubChapterClick(chapter.id)}
															className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EECE84] text-black rounded-lg hover:bg-[#EECE84]/90 transition-colors text-xs font-semibold"
														>
															<Plus className="w-3 h-3" />
															Add SubChapter
														</button>
													</div>
													{loadingSubChapters[chapter.id] ? (
														<div className="flex justify-center py-4">
															<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#EECE84]" />
														</div>
													) : (
														<div className="space-y-2">
															{(subChapters[chapter.id] || []).map((subChapter) => (
																<div
																	key={subChapter.id}
																	className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-[#EECE84] transition-colors"
																>
																	<span className="text-sm">{subChapter.sub_chapter_text}</span>
																	<button
																		onClick={() => {
																			setSelectedChapterId(chapter.id);
																			setEditingSubChapter(subChapter);
																			setIsSubChapterModalOpen(true);
																		}}
																		className="p-1 hover:bg-gray-100 rounded transition-colors"
																	>
																		<Pencil className="w-4 h-4" />
																	</button>
																</div>
															))}
														</div>
													)}
												</div>
											</motion.div>
										</div>
									))}
								</div>
							</div>
						) : (
							<div className="flex h-64 items-center justify-center text-gray-500">
								Select a topic to view its chapters
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Modals */}
			{(isChapterModalOpen || editingChapter) && (
				<div className="fixed inset-0 z-50 overflow-y-auto">
					<div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
					<div className="flex min-h-full items-center justify-center p-4">
						<div className="relative bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
							<h2 className="text-2xl font-bold text-gray-900 mb-6">
								{editingChapter ? 'Edit Chapter' : 'Create New Chapter'}
							</h2>
							<ChapterForm
								onSubmit={editingChapter ? handleUpdateChapter : handleCreateChapter}
								initialData={editingChapter || undefined}
								onCancel={() => {
									setIsChapterModalOpen(false);
									setEditingChapter(null);
								}}
								isLoading={isLoading}
								topics={topics}
							/>
						</div>
					</div>
				</div>
			)}

			{(isSubChapterModalOpen || editingSubChapter) && (
				<div className="fixed inset-0 z-50 overflow-y-auto">
					<div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
					<div className="flex min-h-full items-center justify-center p-4">
						<div className="relative bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
							<h2 className="text-2xl font-bold text-gray-900 mb-6">
								{editingSubChapter ? 'Edit SubChapter' : 'Create New SubChapter'}
							</h2>
							<SubChapterForm
								onSubmit={editingSubChapter ? handleUpdateSubChapter : handleCreateSubChapter}
								initialData={editingSubChapter || undefined}
								onCancel={() => {
									setIsSubChapterModalOpen(false);
									setEditingSubChapter(null);
								}}
								isLoading={isLoading}
								chapters={chapters}
							/>
						</div>
					</div>
				</div>
			)}

			{/* Add Topic Modal */}
			{isAddTopicModalOpen && (
				<div className="fixed inset-0 z-50 overflow-y-auto">
					<div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
					<div className="flex min-h-full items-center justify-center p-4">
						<div className="relative bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
							<h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Topic</h2>
							<label className="block text-sm font-medium text-gray-700 mb-2">Topic Name</label>
							<input
								type="text"
								value={newTopicName}
								onChange={(e) => setNewTopicName(e.target.value)}
								className={inputClassName}
								placeholder="Enter topic name"
							/>
							<div className="flex justify-end mt-6">
								<button
									type="button"
									onClick={() => setIsAddTopicModalOpen(false)}
									className="bg-white py-2 px-4 border border-gray-300 rounded-[12px] shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#EECE84] focus:ring-offset-2"
								>
									Cancel
								</button>
								<button
									type="button"
									onClick={handleCreateTopic}
									className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-[12px] bg-[#EECE84] hover:bg-[#EECE84]/90 focus:outline-none focus:ring-2 focus:ring-[#EECE84] focus:ring-offset-2"
								>
									Create Topic
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ContentManagement;
import React, { useState } from 'react';
import { useAuth, useClerk } from '@/lib/mock-clerk';
import { Edit2, Trash2, MessageCircle } from 'lucide-react';
import { ForumComment } from '@/lib/forum';
import { CommentForm } from './comment-for';

interface CommentProps {
	comment: ForumComment;
	onDelete: (id: string) => void;
	onUpdate: (id: string, content: string) => void;
	onReply: (parentCommentId: string, content: string) => void;
}

export function Comment({ comment, onDelete, onUpdate, onReply }: CommentProps) {
	const { user } = useClerk();
	const [isEditing, setIsEditing] = useState(false);
	const [editedContent, setEditedContent] = useState(comment.content);
	const [showReplyForm, setShowReplyForm] = useState(false);
	const { userId } = useAuth();
	const isAuthor = userId === comment.user_id;

	const handleSave = async () => {
		onUpdate(comment.id, editedContent);
		setIsEditing(false);
	};

	const handleDelete = () => {
		onDelete(comment.id);
	};

	return (
		<div className="group relative">
			<div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
				{/* User Avatar */}
				<div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
					{comment.user_id.charAt(0).toUpperCase()}
				</div>

				<div className="flex-1 min-w-0">
					{isEditing ? (
						<div className="space-y-2">
							<textarea
								value={editedContent}
								onChange={(e) => setEditedContent(e.target.value)}
								className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
								rows={3}
							/>
							<div className="flex gap-2">
								<button 
									onClick={handleSave}
									className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
								>
									Enregistrer
								</button>
								<button 
									onClick={() => setIsEditing(false)}
									className="px-4 py-2 text-sm font-medium bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
								>
									Annuler
								</button>
							</div>
						</div>
					) : (
						<>
							<div className="mb-1">
								<span className="font-semibold text-gray-900">
									@ {user?.firstName} {user?.lastName}
								</span>
							</div>
							<p className="text-gray-700 whitespace-pre-wrap break-words">
								{comment.content}
							</p>
							<div className="mt-2 flex items-center gap-4 text-sm">
								<button 
									onClick={() => setShowReplyForm(!showReplyForm)}
									className="text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1"
								>
									<MessageCircle className="w-4 h-4" />
									Répondre
								</button>
								{isAuthor && (
									<>
										<button 
											onClick={() => setIsEditing(true)}
											className="text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1"
										>
											<Edit2 className="w-4 h-4" />
											Modifier
										</button>
										<button 
											onClick={handleDelete}
											className="text-gray-500 hover:text-red-600 font-medium flex items-center gap-1"
										>
											<Trash2 className="w-4 h-4" />
											Supprimer
										</button>
									</>
								)}
							</div>
						</>
					)}

					{showReplyForm && (
						<div className="mt-4">
							<CommentForm
								onSubmit={(content) => {
									onReply(comment.id, content);
									setShowReplyForm(false);
								}}
								placeholder="Write a reply..."
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
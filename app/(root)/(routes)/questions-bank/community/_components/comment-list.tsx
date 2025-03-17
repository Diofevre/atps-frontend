import React from 'react';
import type { ForumComment } from '@/lib/forum';
import { Comment } from './comment';

interface CommentListProps {
    comments: ForumComment[];
    onDelete: (id: string) => void;
    onUpdate: (id: string, content: string) => void;
    onReply: (parentCommentId: string, content: string) => void;
}

export function CommentList({ comments, onDelete, onUpdate, onReply }: CommentListProps) {
    const parentComments = comments.filter(comment => !comment.parent_comment_id);

    const renderComments = (commentId: number | undefined, level: number = 0) => {
        const children = comments.filter(comment => Number(comment.parent_comment_id) === commentId);
        
        if (children.length === 0) return null;

        return (
            <div className="relative ml-4 md:ml-8 mt-2">
                {/* Vertical connection line */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gray-200"></div>
                
                {/* Comments */}
                <div className="space-y-3">
                    {children.map(comment => (
                        <div key={comment.id} className="relative">
                            {/* Horizontal connection line */}
                            <div className="absolute left-0 top-6 w-4 h-[2px] bg-gray-200 -translate-x-[2px]"></div>
                            
                            <div className="pl-6">
                                <Comment
                                    comment={comment}
                                    onDelete={onDelete}
                                    onUpdate={onUpdate}
                                    onReply={onReply}
                                />
                                {renderComments(Number(comment.id), level + 1)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {parentComments.map(comment => (
                <div key={comment.id}>
                    <Comment
                        comment={comment}
                        onDelete={onDelete}
                        onUpdate={onUpdate}
                        onReply={onReply}
                    />
                    {renderComments(Number(comment.id))}
                </div>
            ))}
        </div>
    );
}
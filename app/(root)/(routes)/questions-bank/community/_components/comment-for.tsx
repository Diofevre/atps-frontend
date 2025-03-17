import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface CommentFormProps {
	onSubmit: (content: string) => void;
	placeholder: string;
}

export function CommentForm({ onSubmit, placeholder }: CommentFormProps) {
	const [content, setContent] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (content.trim()) {
			onSubmit(content);
			setContent('');
		}
	};

	return (
		<form onSubmit={handleSubmit} className="mb-4 relative">
			<textarea
				value={content}
				onChange={(e) => setContent(e.target.value)}
				placeholder={placeholder}
				className="w-full p-4 pr-12 bg-gray-900 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-gray-800 transition-all duration-200 resize-none"
				rows={3}
			/>
			<button
				type="submit"
				disabled={!content.trim()}
				className="absolute right-3 bottom-3 p-2 text-white hover:text-white disabled:text-gray-400 transition-colors disabled:cursor-not-allowed rounded-lg hover:bg-blue-50 disabled:hover:bg-transparent"
			>
				<Send className="h-5 w-5 transform -rotate-45" />
			</button>
		</form>
	);
}
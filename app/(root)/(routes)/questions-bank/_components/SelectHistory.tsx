'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/lib/mock-clerk';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ActionDropdownProps {
  testId: number;
  topic?: string;
  totalQuestions?: number;
  onDelete?: (testId: number) => void;
  isFinished: boolean;
  isValidation?: boolean;
}

function ActionDropdown({ testId, onDelete, isFinished, isValidation = false }: ActionDropdownProps) {
  const router = useRouter();
  const { getToken } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleAction = async (action: string) => {
    if (action === 'Resume' || action === 'Try Again') {
      // For "Try Again", we always remove timeSpents
      // For "Resume", we only remove it if it doesn't exist
      if (action === 'Try Again' || !localStorage.getItem('timeSpents')) {
        localStorage.removeItem('timeSpents');
      }

      if (!testId) {
        console.error('testId is missing. Cannot resume/restart the quiz.');
        return;
      }

      router.push(
        `/questions-bank/study/quizz?testId=${testId}&fromHistory=true${action === 'Try Again' ? '&reset=true' : ''}`
      );
    } else if (action === 'Delete') {
      try {
        const token = await getToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tests/supprimeTest`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ testIds: [testId] }),
        });

        if (!response.ok) {
          throw new Error('Failed to delete the test');
        }

        toast.success('Test deleted successfully');
        
        if (onDelete) {
          onDelete(testId);
        }
      } catch (error) {
        console.error('Error deleting test:', error);
        toast.error('Failed to delete test');
      }
    } else if (action === 'Copy TestId') {
      try {
        await navigator.clipboard.writeText(testId.toString());
        toast.success(`Test ID ${testId} copied to clipboard`);
      } catch (error) {
        console.error('Failed to copy TestId:', error);
        toast.error('Failed to copy TestId');
      }
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
            onClick={(e) => e.stopPropagation()}
          >
            ...
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuLabel>Available Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {(!isValidation || !isFinished) && (
            <DropdownMenuItem 
              onClick={() => handleAction(isFinished ? 'Try Again' : 'Resume')}
            >
              {isFinished ? 'Try Again' : 'Resume'}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => handleAction('Copy TestId')}>
            Copy TestId
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setIsDialogOpen(true)}
            className="text-red-600 focus:text-red-600"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the test.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)} className='border-none hover:bg-transparent shadow-none hover:text-black/50'>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className='rounded-full bg-red-500 text-white hover:bg-red-700'
              onClick={() => {
                handleAction('Delete');
                setIsDialogOpen(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ActionDropdown;
"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useUserInfo } from "@/hooks/useUserInfo";

export default function AlertDisplay({
  id,
  onDeleted,
}: {
  id: string;
  onDeleted?: () => void;
}) {
  const { userInfo } = useUserInfo();
  const subscription = userInfo?.subscriptionRef;
  const premium = subscription?.status === "active" && (!subscription.endDate || new Date(subscription.endDate).getTime() > Date.now());
  const canDelete = premium || subscription?.type === "ppc";

  // Free users are intentionally unable to delete their one included chat.
  // The backend enforces this too; this UI check prevents a misleading action.
  if (!canDelete) return null;

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND}/api/pathway/chat/${id}`);
      toast.success(res.data.message);
      onDeleted?.();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || `Error deleting chat: ${e?.message || e}`);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="cursor-pointer" aria-label="Delete chat">
          <Trash className="text-red-700 w-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Choosing to continue will permanently delete this chat from our servers.{" "}
            <span className="font-bold text-red-400">This action can not be undone.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction className="cursor-pointer" onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

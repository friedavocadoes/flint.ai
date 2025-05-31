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

export default function AlertDisplay({
  id,
  onDeleted,
}: {
  id: string;
  onDeleted?: () => void;
}) {
  const handleDelete = async () => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_BACKEND}/api/pathway/chat/${id}`)
      .then((res) => {
        toast.success(res.data.message);
        if (onDeleted) onDeleted();
      })
      .catch((e) => {
        toast.error(`error deleting chat: ${e}`);
      });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="cursor-pointer">
          <Trash className="text-red-700 w-5 " />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Choosing to continue will permanently delete this chat from our
            servers.{" "}
            <span className="font-bold text-red-400">
              This action can not be undone.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction className="cursor-pointer" onClick={handleDelete}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

import { Upload, FileText, X, File, PlusCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavbarProps {
  files: { id: string; name: string }[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileRemove: (fileId: string) => void;
}

export function Navbar({ files, onFileChange, onFileRemove }: NavbarProps) {
  return (
    <nav className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
      <img src="/logo.png" alt="PDF Chat" className="h-10 w-auto" />
      <div className="flex items-center gap-4">
        <ScrollArea className="h-10 w-auto max-w-[50vw]">
          <div className="flex gap-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-2 px-3 py-1 text-sm lg:text-base font-medium text-[#0FA958]"
              >
                <File className="size-8 stroke-[1.5] p-1 border-2 border-[#0FA958] rounded" />
                <span>{file.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 rounded-full"
                  onClick={() => onFileRemove(file.id)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {file.name}</span>
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
        <label
          htmlFor="file-upload"
          className="flex items-center gap-2 px-2 lg:px-8 py-2 text-sm text-black bg-white border border-black rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          <span className="hidden lg:block">Upload PDF</span>
          <input
            id="file-upload"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={onFileChange}
          />
        </label>
      </div>
    </nav>
  );
}

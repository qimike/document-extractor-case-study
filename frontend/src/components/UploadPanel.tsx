import { useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

export default function UploadPanel({
  onUpload,
}: {
  onUpload: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFile = (f: File) => {
    setFile(f);
    onUpload(f);
  };

  return (
    <Box
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) handleFile(droppedFile);
      }}
      sx={{
        border: "2px dashed",
        borderColor: dragOver ? "primary.main" : "grey.300",
        borderRadius: 3,
        p: 8,
        textAlign: "center",
        backgroundColor: dragOver ? "primary.50" : "transparent",
        transition: "all 0.2s ease",
        cursor: "pointer",
      }}
      onClick={() => inputRef.current?.click()}
    >

      <input
        ref={inputRef}
        type="file"
        hidden
        accept="image/png,image/jpeg,application/pdf,.docx"
        onChange={(e) => {
          const selected = e.target.files?.[0];
          if (selected) handleFile(selected);
        }}
      />


      <CloudUploadOutlinedIcon
        sx={{
          fontSize: 48,
          color: "primary.light",
          mb: 2,
        }}
      />

      <Typography variant="h6" sx={{ mb: 0.5 }}>
        select your file or drag and drop
      </Typography>


      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        png, pdf, jpg, pdf accepted
      </Typography>


      <Button
        variant="contained"
        size="large"
        sx={{
          textTransform: "none",
          px: 4,
          borderRadius: 2,
        }}
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.click();
        }}
      >
        browse
      </Button>

      {/* Selected file name */}
      {file && (
        <Typography
          variant="body2"
          sx={{ mt: 3, color: "text.secondary" }}
        >
          Selected: <strong>{file.name}</strong>
        </Typography>
      )}
    </Box>
  );
}

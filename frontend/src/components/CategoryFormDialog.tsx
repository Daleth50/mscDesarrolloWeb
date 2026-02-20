import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

type CategoryFormDialogProps = {
  open: boolean;
  title: string;
  confirmLabel: string;
  value: string;
  saving: boolean;
  onClose: () => void;
  onChange: (value: string) => void;
  onConfirm: () => void;
};

export default function CategoryFormDialog({
  open,
  title,
  confirmLabel,
  value,
  saving,
  onClose,
  onChange,
  onConfirm,
}: CategoryFormDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="category-name"
          label="Nombre"
          type="text"
          fullWidth
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={saving || !value.trim()}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

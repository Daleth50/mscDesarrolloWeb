import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

type CategoryFormData = {
  name: string;
  ordering: number | null;
  color: string;
};

type CategoryFormDialogProps = {
  open: boolean;
  title: string;
  confirmLabel: string;
  formData: CategoryFormData;
  saving: boolean;
  onClose: () => void;
  onChange: (field: keyof CategoryFormData, value: string | number | null) => void;
  onConfirm: () => void;
};

export default function CategoryFormDialog({
  open,
  title,
  confirmLabel,
  formData,
  saving,
  onClose,
  onChange,
  onConfirm,
}: CategoryFormDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            autoFocus
            id="category-name"
            label="Nombre"
            type="text"
            fullWidth
            value={formData.name}
            onChange={(event) => onChange('name', event.target.value)}
            required
          />
          <TextField
            id="category-ordering"
            label="Orden"
            type="number"
            fullWidth
            value={formData.ordering ?? ''}
            onChange={(event) => 
              onChange('ordering', event.target.value ? parseInt(event.target.value) : null)
            }
          />
          <TextField
            id="category-color"
            label="Color"
            type="color"
            fullWidth
            value={formData.color}
            onChange={(event) => onChange('color', event.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={saving || !formData.name.trim()}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

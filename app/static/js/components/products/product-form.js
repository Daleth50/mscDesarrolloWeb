import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Box, Button, InputLabel, MenuItem, FormControl, Select, TextField } from '@mui/material';

function getInitialData() {
    const dataElement = document.getElementById('new-product-initial-data');
    if (!dataElement) {
        return { categories: [], form_data: {} };
    }

    try {
        const parsed = JSON.parse(dataElement.textContent || '{}');
        return {
            categories: Array.isArray(parsed.categories) ? parsed.categories : [],
            form_data: parsed.form_data && typeof parsed.form_data === 'object' ? parsed.form_data : {},
        };
    } catch {
        return { categories: [], form_data: {} };
    }
}

const initialData = getInitialData();
const formMode = initialData.mode === 'edit' ? 'edit' : 'create';
const submitLabel = initialData.submit_label || (formMode === 'edit' ? 'Guardar cambios' : 'Crear producto');
const cancelUrl = initialData.cancel_url || '';

function NewProductForm() {
    const [taxRate, setTaxRate] = React.useState(String(initialData.form_data.tax_rate ?? '0'));
    const [taxonomyId, setTaxonomyId] = React.useState(String(initialData.form_data.taxonomy_id ?? ''));

    const handleTaxRateChange = (event) => {
        setTaxRate(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setTaxonomyId(event.target.value);
    };

    return (
        <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField
                id="name"
                name="name"
                label="Nombre del producto"
                variant="outlined"
                fullWidth
                required
                defaultValue={initialData.form_data.name ?? ''}
            />

            <TextField
                id="sku"
                name="sku"
                label="SKU"
                variant="outlined"
                fullWidth
                defaultValue={initialData.form_data.sku ?? ''}
            />

            <TextField
                id="price"
                name="price"
                label="Precio"
                type="number"
                variant="outlined"
                fullWidth
                required
                inputProps={{ step: '0.01', min: '0' }}
                defaultValue={initialData.form_data.price ?? '0'}
            />

            <TextField
                id="cost"
                name="cost"
                label="Costo"
                type="number"
                variant="outlined"
                fullWidth
                required
                inputProps={{ step: '0.01', min: '0' }}
                defaultValue={initialData.form_data.cost ?? '0'}
            />

            <FormControl fullWidth>
                <InputLabel id="category-label">Categoría</InputLabel>
                <Select
                    labelId="category-label"
                    id="category"
                    name="taxonomy_id"
                    value={taxonomyId}
                    label="Categoría"
                    onChange={handleCategoryChange}
                >
                    <MenuItem value="">Sin categoría</MenuItem>
                    {initialData.categories.map((categoryOption) => (
                        <MenuItem key={categoryOption.id} value={categoryOption.id}>{categoryOption.label}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth required>
                <InputLabel id="tax-rate-label">Tasa de impuesto</InputLabel>
                <Select
                    labelId="tax-rate-label"
                    id="tax_rate"
                    name="tax_rate"
                    value={taxRate}
                    label="Tasa de impuesto"
                    onChange={handleTaxRateChange}
                >
                    <MenuItem value="0">0%</MenuItem>
                    <MenuItem value="8">8%</MenuItem>
                    <MenuItem value="16">16%</MenuItem>
                </Select>
            </FormControl>

            <Box className="flex flex-row gap-2 justify-end">
                <Button variant="outlined" onClick={() => (cancelUrl ? (window.location.href = cancelUrl) : window.history.back())}>Cancelar</Button>
                <Button type="submit" variant="contained">{submitLabel}</Button>
            </Box>
        </Box>
    );
}

const formElement = document.getElementById('new-product-form');
if (formElement && !formElement.dataset.rendered) {
    createRoot(formElement).render(<NewProductForm />);
    formElement.dataset.rendered = 'true';
}

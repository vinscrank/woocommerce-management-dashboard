// import { Checkbox, Typography, Box, FormControl } from '@mui/material';
// import { Iconify } from './iconify';
// import { Categoria } from 'src/types/Categoria';
// import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
// import { TreeItem } from '@mui/x-tree-view/TreeItem';

// export interface CategoryState {
//     checked: boolean;
//     partialChecked: boolean;
// }

// interface CategorieTreeViewProps {
//     categorie: Categoria[];
//     selectedStates: Record<string, CategoryState>;
//     onCategorieChange: (selected: Record<string, CategoryState>) => void;
// }

// export const CategorieTreeView = ({ categorie, selectedStates, onCategorieChange }: CategorieTreeViewProps) => {
//     const handleSelect = (categoryId: string) => {
//         const currentState = selectedStates[categoryId];

//         // Gestione più robusta dello stato
//         const newStates = { ...selectedStates };

//         if (!currentState?.checked) {
//             // Selezione della categoria
//             newStates[categoryId] = {
//                 checked: true,
//                 partialChecked: false
//             };

//             // Se la categoria ha figli, li selezioniamo automaticamente
//             const categoria = findCategoriaById(categorie, parseInt(categoryId));
//             if (categoria?.children) {
//                 categoria.children.forEach(child => {
//                     newStates[child.id.toString()] = {
//                         checked: true,
//                         partialChecked: false
//                     };
//                 });
//             }
//         } else {
//             // Deselezione della categoria
//             delete newStates[categoryId];

//             // Rimuoviamo anche i figli se presenti
//             const categoria = findCategoriaById(categorie, parseInt(categoryId));
//             if (categoria?.children) {
//                 categoria.children.forEach(child => {
//                     delete newStates[child.id.toString()];
//                 });
//             }
//         }

//         onCategorieChange(newStates);
//     };

//     // Funzione helper per trovare una categoria per ID
//     const findCategoriaById = (categories: Categoria[], id: number): Categoria | null => {
//         for (const cat of categories) {
//             if (cat.id === id) return cat;
//             if (cat.children) {
//                 const found = findCategoriaById(cat.children, id);
//                 if (found) return found;
//             }
//         }
//         return null;
//     };

//     // Funzione per ottenere gli ID dei nodi da espandere
//     const getExpandedNodes = (categories: Categoria[]): string[] => {
//         const expanded: string[] = [];

//         const checkNode = (node: Categoria) => {
//             if (node.children) {
//                 // Espandi il nodo se ha figli selezionati
//                 const hasSelectedChildren = node.children.some(child =>
//                     selectedStates[child.id.toString()]?.checked ||
//                     selectedStates[child.id.toString()]?.partialChecked
//                 );

//                 if (hasSelectedChildren) {
//                     expanded.push(node.id.toString());
//                 }

//                 // Controlla ricorsivamente i figli
//                 node.children.forEach(checkNode);
//             }
//         };

//         categories.forEach(checkNode);
//         return expanded;
//     };

//     const renderTreeItems = (nodes: Categoria[]) => (
//         nodes.map((node) => {
//             const state = selectedStates[node.id.toString()];

//             return (
//                 <TreeItem
//                     key={node.id}
//                     itemId={node.id.toString()}
//                     label={
//                         <Box sx={{
//                             display: 'flex',
//                             alignItems: 'center',
//                         }}>
//                             <Checkbox
//                                 size="small"
//                                 checked={state?.checked ?? false}
//                                 indeterminate={state?.partialChecked ?? false}
//                                 onChange={() => handleSelect(node.id.toString())}
//                                 onClick={(e) => e.stopPropagation()}
//                                 sx={{ mr: 1 }}
//                             />
//                             <Typography variant="body2">{node.name}</Typography>
//                         </Box>
//                     }
//                 >
//                     {node.children && node.children.length > 0 && renderTreeItems(node.children)}
//                 </TreeItem>
//             );
//         })
//     );

//     return (
//         <FormControl fullWidth>
//             <SimpleTreeView
//                 defaultExpandedItems={getExpandedNodes(categorie)}
//                 sx={{
//                     height: 'auto',
//                     maxHeight: '500px',
//                     flexGrow: 1,
//                     overflowY: 'auto',
//                     border: '1px solid',
//                     borderColor: 'divider',
//                     borderRadius: 1,
//                     bgcolor: 'background.paper',
//                 }}
//             >
//                 {renderTreeItems(categorie)}
//             </SimpleTreeView>
//         </FormControl>
//     );
// }; 
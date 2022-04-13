export interface TreeViewEntryModel {
    id: string;
    children: TreeViewEntryModel[];
    name: string;
    open?: boolean;
    icon?: string;
    selectable: boolean;
    parentId: string;
}
import { Radio, Table, TableColumnProps, TableColumnsType } from "antd";
import { Land, RiceVariety, Seed } from "../../models/season-model";

export const RiceVarietyColumns: TableColumnsType<Seed> = [
    {
        title: 'ID',
        dataIndex: 'id',
        hidden: true
    },
    {
        title: 'Name',
        dataIndex: 'name',
        width: 'max-content',
    },
    {
        title: 'Stock',
        dataIndex: 'stock',
        width: 'max-content',
    },
    {
        title: 'Description',
        dataIndex: 'description',
        width: 'max-content',
    },
    {
        title: 'History',
        dataIndex: 'history',
        width: 'max-content',
    }
];

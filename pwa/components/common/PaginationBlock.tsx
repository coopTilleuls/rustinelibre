import React, {ChangeEvent} from "react";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import {useState} from 'react';

interface PaginationBlockProps {
    totalItems: number;
    onPageChange: (pageNumber: number) => void;
}

const PaginationBlock = ({totalItems, onPageChange}: PaginationBlockProps): JSX.Element => {

    const [currentPage, setCurrentPage] = useState<number>(1);
    const totalPages = Math.ceil(totalItems / 20);

    const handlePageChange = (event: ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
        onPageChange(page);
    };

    return (
        <Stack spacing={2}>
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
                size="large"
            />
        </Stack>
    );
};

export default PaginationBlock;

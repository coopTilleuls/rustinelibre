import React from "react";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

interface PaginationBlockProps {
    totalItems: number;
    onPageChange: (pageNumber: number) => void;
}

const PaginationBlock = ({totalItems, onPageChange}: PaginationBlockProps): JSX.Element => {

    const [currentPage, setCurrentPage] = React.useState(1);
    const totalPages = Math.ceil(totalItems / 20);

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
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
import React, {ChangeEvent, useContext} from "react";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import {SearchRepairerContext} from "@contexts/SearchRepairerContext";

interface PaginationBlockProps {
    onPageChange: (pageNumber: number) => void;
}

const PaginationBlock = ({onPageChange}: PaginationBlockProps): JSX.Element => {

    const {currentPage, setCurrentPage, totalItems} = useContext(SearchRepairerContext);
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

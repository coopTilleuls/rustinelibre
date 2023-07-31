import React, {ChangeEvent, useEffect, useState} from 'react';
import Link from 'next/link';
import {userResource} from '@resources/userResource';
import ConfirmationModal from '@components/common/ConfirmationModal';
import {
  Box,
  Pagination,
  Stack,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  CircularProgress,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import {User} from '@interfaces/User';
import {formatDate} from '@helpers/dateHelper';

export const UsersList = (): JSX.Element => {
  const [loadingList, setLoadingList] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedUserToDelete, setSelectedUserToDelete] = useState<User | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [removePending, setRemovePending] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDeleteClick = (user: User) => {
    setDeleteDialogOpen(true);
    setSelectedUserToDelete(user);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUserToDelete) {
      return;
    }
    setRemovePending(true);
    setDeleteDialogOpen(false);
    setErrorMessage(null);
    try {
      await userResource.delete(selectedUserToDelete['@id']);
      setRemovePending(false);
      setSelectedUserToDelete(null);
      await fetchUsers();
    } catch (e: any) {
      setErrorMessage('Suppression impossible de cet utilisateur.');
    }
  };

  const fetchUsers = async () => {
    setLoadingList(true);
    let params = {
      page: `${currentPage ?? 1}`,
      itemsPerPage: 30,
      'order[id]': 'DESC',
    };

    if ('' !== searchTerm) {
      params = {...{userSearch: searchTerm}, ...params};
      params.page = '1';
    }

    const response = await userResource.getAll(true, params);
    setUsers(response['hydra:member']);
    setTotalPages(Math.ceil(response['hydra:totalItems'] / 30));
    setLoadingList(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect((): void => {
    fetchUsers();
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (event: ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleSearchTermChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  const getStatus = (status: boolean): string => {
    if (status) {
      return 'Activé';
    }
    return 'Mail non confirmé';
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      fetchUsers();
    }
  };

  return (
    <Box>
      <TextField
        label="Chercher..."
        value={searchTerm}
        onChange={handleSearchTermChange}
        onKeyPress={handleKeyPress}
        inputProps={{maxLength: 180}}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <TableContainer elevation={4} component={Paper} sx={{marginTop: '10px'}}>
        <Table aria-label="employees">
          <TableHead
            sx={{
              '& th': {
                fontWeight: 'bold',
                color: 'primary.main',
              },
            }}>
            <TableRow>
              <TableCell align="left">Nom</TableCell>
              <TableCell align="center">Statut</TableCell>
              <TableCell align="center">Dernière connexion</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingList && <CircularProgress sx={{ml: 5, mt: 5}} />}
            {users.map((user) => (
              <TableRow
                key={user.id}
                sx={{
                  '&:last-child td, &:last-child th': {border: 0},
                }}>
                <TableCell align="left" component="th" scope="row">
                  {user.firstName} {user.lastName}
                  <br />
                  <Typography sx={{color: 'grey'}}>{user.email}</Typography>
                </TableCell>
                <TableCell align="center">
                  {getStatus(user.emailConfirmed)}
                </TableCell>
                <TableCell align="center" sx={{cursor: 'pointer'}}>
                  {user.lastConnect && formatDate(user.lastConnect)}
                </TableCell>
                <TableCell align="right">
                  <>
                    <Link
                      href={`/admin/utilisateurs/edit/${user.id}`}
                      legacyBehavior
                      passHref>
                      <IconButton color="secondary">
                        <EditIcon color="secondary" />
                      </IconButton>
                    </Link>
                    {removePending &&
                    selectedUserToDelete &&
                    selectedUserToDelete.id === user.id ? (
                      <CircularProgress />
                    ) : (
                      <IconButton
                        color="secondary"
                        onClick={() => handleDeleteClick(user)}>
                        <DeleteForeverIcon />
                      </IconButton>
                    )}
                  </>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {totalPages > 1 && (
        <Stack spacing={2} sx={{marginTop: '20px'}}>
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
      )}
      {selectedUserToDelete && (
        <ConfirmationModal
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          loading={removePending}
          errorMessage={
            errorMessage
          }>{`Êtes-vous sûr de vouloir supprimer l'utilisateur "${selectedUserToDelete.firstName} ${selectedUserToDelete.lastName}" ?`}</ConfirmationModal>
      )}
    </Box>
  );
};

export default UsersList;

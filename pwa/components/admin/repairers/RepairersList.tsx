import React, {ChangeEvent, useEffect, useState} from 'react';
import Link from 'next/link';
import {repairerResource} from '@resources/repairerResource';
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
  Switch,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import CircleIcon from '@mui/icons-material/Circle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {formatDate} from '@helpers/dateHelper';
import {Repairer} from '@interfaces/Repairer';

export const RepairersList = (): JSX.Element => {
  const [loadingList, setLoadingList] = useState<boolean>(false);
  const [repairers, setRepairers] = useState<Repairer[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [removePending, setRemovePending] = useState<boolean>(false);
  const [selectedRepairerToDelete, setSelectedRepairerToDelete] =
    useState<Repairer | null>(null);

  const fetchRepairers = async () => {
    setLoadingList(true);
    let params = {
      page: `${currentPage ?? 1}`,
      itemsPerPage: 30,
      'order[id]': 'DESC',
    };

    if ('' !== searchTerm) {
      params = {...{repairerSearch: searchTerm}, ...params};
      params.page = '1';
    }

    const response = await repairerResource.getAll(true, params);
    setRepairers(response['hydra:member']);
    setTotalPages(Math.ceil(response['hydra:totalItems'] / 30));
    setLoadingList(false);
  };

  useEffect(() => {
    fetchRepairers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect((): void => {
    fetchRepairers();
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDeleteClick = (repairer: Repairer) => {
    setDeleteDialogOpen(true);
    setSelectedRepairerToDelete(repairer);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRepairerToDelete) {
      return;
    }
    setRemovePending(true);
    setDeleteDialogOpen(false);
    try {
      await repairerResource.delete(selectedRepairerToDelete['@id']);
      setRemovePending(false);
      setSelectedRepairerToDelete(null);
      await fetchRepairers();
    } catch (e: any) {
      setRemovePending(false);
    }
    setRemovePending(false);
  };

  const handlePageChange = (event: ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleSearchTermChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      fetchRepairers();
    }
  };

  const handleSwitchChange = async (event: ChangeEvent, repairer: Repairer) => {
    const isChecked = (event.target as HTMLInputElement).checked;
    await repairerResource.put(repairer['@id'], {
      enabled: isChecked,
    });
    const updatedRepairerList = repairers.map((r: Repairer) => {
      if (r.id === repairer.id) {
        return {...r, enabled: isChecked};
      }
      return r;
    });
    setRepairers(updatedRepairerList);
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
              <TableCell align="center">Activé</TableCell>
              <TableCell align="center">Dernière connexion</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingList && <CircularProgress sx={{ml: 5, mt: 5}} />}
            {repairers.map((repairer) => (
              <TableRow
                key={repairer.id}
                sx={{
                  '&:last-child td, &:last-child th': {border: 0},
                }}>
                <TableCell align="left" component="th" scope="row">
                  {repairer.name}
                  <br />
                  {repairer.owner && (
                    <Typography sx={{color: 'grey'}}>
                      {repairer.owner.email}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="center">
                  {repairer.enabled && (
                    <span
                      style={{
                        color: '#027f00',
                        backgroundColor: '#cdffcd',
                        padding: '10px',
                        borderRadius: '10px',
                      }}>
                      <CircleIcon sx={{fontSize: '0.8em'}} /> Actif
                    </span>
                  )}
                  {!repairer.enabled && (
                    <span
                      style={{
                        color: '#a36f1a',
                        backgroundColor: '#ffeccb',
                        padding: '10px',
                        borderRadius: '10px',
                      }}>
                      <CircleIcon sx={{fontSize: '0.8em'}} /> En attente
                    </span>
                  )}
                </TableCell>
                <TableCell align="center">
                  <Switch
                    checked={repairer.enabled}
                    onChange={(event) => handleSwitchChange(event, repairer)}
                    inputProps={{'aria-label': 'controlled'}}
                  />
                </TableCell>
                <TableCell align="center">
                  {repairer.owner.lastConnect &&
                    formatDate(repairer.owner.lastConnect)}
                </TableCell>
                <TableCell align="right">
                  <Link
                    href={`/admin/reparateurs/edit/${repairer.id}`}
                    legacyBehavior
                    passHref>
                    <IconButton color="secondary">
                      <EditIcon color="secondary" />
                    </IconButton>
                  </Link>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteClick(repairer)}>
                    <DeleteForeverIcon />
                  </IconButton>
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
      {selectedRepairerToDelete && (
        <ConfirmationModal
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          loading={
            removePending
          }>{`Êtes-vous sûr de vouloir supprimer le réparateur "${selectedRepairerToDelete.name}" ?`}</ConfirmationModal>
      )}
    </Box>
  );
};

export default RepairersList;

import React, {useEffect, useState} from "react";
import {RepairerEmployee} from "@interfaces/RepairerEmployee";
import {repairerEmployeesResource} from "@resources/repairerEmployeesResource";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import TableContainer from "@mui/material/TableContainer";
import {User} from "@interfaces/User";
import EmployeesListActions from "@components/dashboard/employees/EmployeesListActions";
import {CircularProgress} from "@mui/material";

interface EmployeesListProps {
    currentBoss: User|null;
}

export const EmployeesList = ({currentBoss}: EmployeesListProps): JSX.Element => {

    const [loadingList, setLoadingList] = useState<boolean>(false);
    const [employees, setEmployees] = useState<RepairerEmployee[]>([]);

    async function fetchEmployees() {
        const response = await repairerEmployeesResource.getAll();
        setEmployees(response['hydra:member']);
        setLoadingList(false);
    }

    useEffect(() => {
        setLoadingList(true);
        fetchEmployees();
    }, []);

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="employees">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nom</TableCell>
                            <TableCell align="right">Rôle</TableCell>
                            <TableCell align="right">Status</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            currentBoss && <TableRow
                                key={currentBoss.firstName+' '+currentBoss.lastName}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {currentBoss.firstName+' '+currentBoss.lastName}
                                </TableCell>
                                <TableCell align="right">Admin</TableCell>
                                <TableCell align="right" style={{color: 'green'}}><RadioButtonCheckedIcon color="success" />Actif</TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        }
                        {loadingList && <CircularProgress />}
                        {employees.map((repairerEmployee) => (
                            <TableRow
                                key={repairerEmployee.employee.firstName+' '+repairerEmployee.employee.lastName}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {repairerEmployee.employee.firstName+' '+repairerEmployee.employee.lastName}
                                </TableCell>
                                <TableCell align="right">Réparateur</TableCell>
                                <TableCell align="right">
                                    {repairerEmployee.enabled ?
                                        <span style={{color: 'green'}}><RadioButtonCheckedIcon />Actif</span> : 'Inactif'}
                                </TableCell>
                                <TableCell align="right">
                                    <EmployeesListActions employee={repairerEmployee} fetchEmployees={fetchEmployees}/>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default EmployeesList;

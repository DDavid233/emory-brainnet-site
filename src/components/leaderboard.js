import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { visuallyHidden } from '@mui/utils';
import {ToggleButtonGroup, ToggleButton, Divider} from "@mui/material";

export function createData(method, acc, acc_std, auc, auc_std, ref_link, date) {
    return { method, acc, acc_std, auc, auc_std, ref_link, date };
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
// function stableSort(array, comparator) {
//     const stabilizedThis = array.map((el, index) => [el, index]);
//     stabilizedThis.sort((a, b) => {
//         const order = comparator(a[0], b[0]);
//         if (order !== 0) {
//             return order;
//         }
//         return a[1] - b[1];
//     });
//     return stabilizedThis.map((el) => el[0]);
// }

const headCells = [
    {
        id: 'rank',
        numeric: true,
        disablePadding: true,
        label: 'Rank',
    },
    {
        id: 'method',
        numeric: false,
        disablePadding: false,
        label: 'Method',
    },
    {
        id: 'acc',
        numeric: true,
        disablePadding: false,
        label: 'Accuracy',
    },
    {
        id: 'acc_std',
        numeric: true,
        disablePadding: false,
        label: 'Acc Std',
    },
    {
        id: 'auc',
        numeric: true,
        disablePadding: false,
        label: 'AUC',
    },
    {
        id: 'auc_std',
        numeric: true,
        disablePadding: false,
        label: 'AUC Std',
    },
    {
        id: 'ref_link',
        numeric: false,
        disablePadding: false,
        label: 'Reference Link',
    },
    {
        id: 'date',
        numeric: false,
        disablePadding: false,
        label: 'Date',
    }
];

function EnhancedTableHead(props) {
    const { order, orderBy, rowCount, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
    const { numSelected } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Nutrition
                </Typography>
            )}

            {/*{numSelected > 0 ? (*/}
            {/*    <Tooltip title="Delete">*/}
            {/*        <IconButton>*/}
            {/*            <DeleteIcon />*/}
            {/*        </IconButton>*/}
            {/*    </Tooltip>*/}
            {/*) : (*/}
            {/*    <Tooltip title="Filter list">*/}
            {/*        <IconButton>*/}
            {/*            <FilterListIcon />*/}
            {/*        </IconButton>*/}
            {/*    </Tooltip>*/}
            {/*)}*/}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable(props) {
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('auc');
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [rows, setRows] = React.useState(props.rows['HIV']);
    const [dataset, setDataset] = React.useState("HIV");

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const handleDatasetChange = (event) => {
        setDataset(event.target.value);
        setRows(props.rows[event.target.value]);
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                {/*<EnhancedTableToolbar numSelected={selected.length} />*/}
                {/* Add Padding */}

                <TableContainer>
                    {/* Center button group*/}
                    <ToggleButtonGroup
                        color="primary"
                        value={dataset}
                        exclusive
                        onChange={handleDatasetChange}
                        style={{ margin: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                        <ToggleButton value="HIV">HIV</ToggleButton>
                        <ToggleButton value="PNC">PNC</ToggleButton>
                        <ToggleButton value="PPMI">PPMI</ToggleButton>
                        <ToggleButton value="ABCD">ABCD</ToggleButton>
                    </ToggleButtonGroup>

                    <Divider />

                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
                            {rows.slice().sort(getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    // const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            tabIndex={0}
                                            key={row.method}
                                            minWidth={1600}
                                        >
                                            <TableCell align="right">{index+1}</TableCell>
                                            <TableCell align="left">{row.method}</TableCell>
                                            <TableCell align="right">{row.acc}</TableCell>
                                            <TableCell align="right">{row.acc_std}</TableCell>
                                            <TableCell align="right">{row.auc}</TableCell>
                                            <TableCell align="right">{row.auc_std}</TableCell>
                                            <TableCell align="left">
                                                <a href={row.ref_link}>
                                                    Link
                                                </a>
                                            </TableCell>
                                            <TableCell align="left">{row.date}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={7} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
            />
        </Box>
    );
}

import React, { useState, useEffect } from 'react';
import { Table, Button, CloseButton } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import BeatLoader from 'react-spinners/BeatLoader';
import axios from 'axios';
import FilterPane from './FilterPane';
import CustomPagination from './CustomPagination';

const TableContainer = ({ coordinates, setShowTableContainer }) => {
	const history = useHistory();
	const [tableDetails, setTableDetails] = useState();
	const [totalCount, setTotalCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [showFilterPane, setShowFilterPane] = useState(false);
	const [filterConfig, setFilterConfig] = useState({
		state: "All",
		time: "All",
		priority: "All"
	});

	const onFilterConfigChange = (newConfig) => {
		setFilterConfig(newConfig);
		setCurrentPage(1);
	};

	const onPageChange = (newPage) => {
		setCurrentPage(newPage);
	};

	const toggleFilterPane = () => {
		setShowFilterPane(showFilterPane => !showFilterPane);
	};

	useEffect(() => {
		const planQueryByPOI = async () => {
			if (coordinates[0] && coordinates[1]) {
				const response = await axios.get(`https://sca-cpt-backend.herokuapp.com/plan/spatial`, {
					params: {
						start: 10 * (currentPage - 1),
						end: 10 * currentPage,
						state: filterConfig.state,
						time: filterConfig.time,
						priority: filterConfig.priority,
						lng: coordinates[0],
						lat: coordinates[1]
					}
				});
				setTableDetails(response.data.data);
				setTotalCount(response.data.totalRowCount);
				if (response.data.totalRowCount !== 0) {
					setShowTableContainer(true);
				} else {
					setShowTableContainer(false);
				}
			}
		};
		planQueryByPOI();
	}, [currentPage, filterConfig, coordinates]);

	return (
		<div className="table-container-wrapper">
			{showFilterPane && (
				<FilterPane
					currentFilterConfig={filterConfig}
					onFilterConfigChange={onFilterConfigChange}
					size="small"
				/>
			)}
			<div className="map-table-filter-button">
				<Button variant="secondary" onClick={toggleFilterPane}>
					Filter
				</Button>
			</div>
			<div id="map-table-container">
				<CloseButton onClick={() => setShowTableContainer(false)} />
				<Table hover borderless striped>
					<thead>
						<tr style={{ borderBottom: '1px solid black' }}>
							<th>Plan Name</th>
							<th>Related State</th>
							<th>Plan Details</th>
						</tr>
					</thead>
					<tbody style={{ borderBottom: '1px solid black' }}>
						{!!tableDetails ? (
							tableDetails.map((row) => (
								<tr key={row.id}>
									<td style={{ width: '50%' }}>
										<div
											style={{
												overflow: 'hidden',
												height: 50,
												display: '-webkit-box',
												WebkitLineClamp: 2,
												WebkitBoxOrient: 'vertical'
											}}
											title={row.agency_lead}
										>
											{row.plan_name}
										</div>
									</td>
									<td>{row.related_state}</td>
									<td>
										<Button
											onClick={() => {
												history.push(`/plan/${row.id}`);
											}}
										>
											Learn more
										</Button>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="3" align="center">
									Loading table
									<BeatLoader size={5} />
								</td>
							</tr>
						)}
					</tbody>
				</Table>
				{!!tableDetails && (
					<CustomPagination
						totalCount={totalCount}
						onPageChange={onPageChange}
						currentPage={currentPage}
					/>
				)}
			</div>
		</div>
	);
};

export default TableContainer;

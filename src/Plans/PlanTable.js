import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import FilterPane from './FilterPane';
import CustomPagination from './CustomPagination';

const PlanTable = () => {
	const history = useHistory();

	// state to store query data
	const [tableDetails, setTableDetails] = useState();
	const [totalCount, setTotalCount] = useState(0);

	// state to store current page for pagination
	const [currentPage, setCurrentPage] = useState(1);

	// state to control visibility of filter pane
	const [showFilterPane, setShowFilterPane] = useState(false);

	// state to control filtering input 
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

	// useEffect for launching query and fetch data from backend
	useEffect(
		() => {
			const asyncFunc = async () => {
				const response = await axios.get(`https://sca-cpt-backend.herokuapp.com/plan`, {
					params: {
						start: 10 * (currentPage - 1),
						end: 10 * currentPage,
						state: filterConfig.state,
						time: filterConfig.time,
						priority: filterConfig.priority
					}
				});
				setTableDetails(response.data.data);
				setTotalCount(response.data.totalRowCount);
			};
			asyncFunc();
		},
		[currentPage, filterConfig]
	);

	return (
		<div className="plan-table-wrapper">
			{showFilterPane && (
				<FilterPane
					currentFilterConfig={filterConfig}
					onFilterConfigChange={onFilterConfigChange}
					size="large"
				/>
			)}
			<Button variant="secondary" className="filter-button" onClick={toggleFilterPane}>Filter</Button>
			<div className="plan-table">
				<Table hover borderless striped>
					<thead>
						<tr style={{ borderBottom: '1px solid black' }}>
							<th>Plan Name</th>
							<th>Primary Planning Method</th>
							<th>Plan Time Frame</th>
							<th>Agency Lead</th>
							<th>Plan Details</th>
							<th>Original Document</th>
						</tr>
					</thead>
					<tbody style={{ borderBottom: '1px solid black' }}>
						{!!tableDetails ? (
							tableDetails.map((row) => (
								<tr key={row.id}>
									<td>{row.plan_name}</td>
									<td>{row.planning_method}</td>
									<td>{row.plan_timeframe}</td>
									<td style={{ width: '15%' }}>
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
											{row.agency_lead}
										</div>
									</td>
									<td>
										<Button
											onClick={() => {
												history.push(`/plan/${row.id}`);
											}}
										>
											Learn more
										</Button>
									</td>
									<td>
										<Button
											onClick={() => {
												window.open(
													row.plan_url.includes('static/assets/')
														? `https://s3.amazonaws.com/planinventory/${row.plan_url}`
														: row.plan_url,
													'_blank'
												);
											}}
										>
											Raw document
										</Button>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="6">Loading table...</td>
							</tr>
						)}
					</tbody>
				</Table>
			</div>
			{!!tableDetails && (
				<CustomPagination totalCount={totalCount} onPageChange={onPageChange} currentPage={currentPage} />
			)}
		</div>
	);
};

export default PlanTable;
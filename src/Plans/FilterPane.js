import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

const FilterPane = ({currentFilterConfig, onFilterConfigChange}) => {
  const [filterConfigInForm, setFilterConfigInForm] = useState({...currentFilterConfig});

	return (
		<nav id="filter-pane">
			<div className="filter-pane-header">
				<h5>Filter Configuration:</h5>
			</div>
			<div className="filter-pane-content">
				<div className="filter-pane-component">
					<span>Related State:</span>
					<select
						className="form-control"
						value={filterConfigInForm.state}
						onChange={(event)=>{
							setFilterConfigInForm({...filterConfigInForm, state: event.target.value})
						}}
					>
						<option value="ALL">All Scale</option>
						<option value="AL">Alabama</option>
						<option value="FL">Florida</option>
						<option value="LA">Louisiana</option>
						<option value="MS">Mississippi</option>
						<option value="TX">Texas</option>
						<option value="SE">Southeast Regional</option>
					</select>
				</div>
				<div className="filter-pane-component">
					<span>Time Frame:</span>
					<select
						className="form-control"
						value={filterConfigInForm.time}
						onChange={(event)=>{
							setFilterConfigInForm({...filterConfigInForm, time: event.target.value})
						}}
					>
						<option value="All">
							All Plans
						</option>
						<option value="5">Plan within 5 years</option>
						<option value="10">Plan within 10 years</option>
						<option value="10+">Plans longer than 10 years</option>
					</select>
				</div>
				<div
					className="filter-pane-component"
					value={filterConfigInForm.priority}
					onChange={(event)=>{
						setFilterConfigInForm({...filterConfigInForm, priority: event.target.value})
					}}
				>
					<span>Priority:</span>
					<select className="form-control">
						<option value="All">
							All Conservations Plans
						</option>
						<option value="WQ">Water Quality Related Plans</option>
						<option value="Hab">Habitat Related Plans</option>
						<option value="LCMR">Resources/Species Related Plans</option>
						<option value="CR">Community Resilience Related Plans</option>
						<option value="ER">Ecosystem Resilience Related Plans</option>
						<option value="ECO">Gulf Economy Related Plans</option>
					</select>
				</div>
				<div className="filter-pane-component">
					<Button
						variant="secondary"
						onClick={()=>onFilterConfigChange(filterConfigInForm)}
					>
						Apply Filter
					</Button>
				</div>
			</div>
		</nav>
	);
};

export default FilterPane;

import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

const FilterPane = ({ currentFilterConfig, onFilterConfigChange, size }) => {
	const [filterConfigInForm, setFilterConfigInForm] = useState({ ...currentFilterConfig });

	return (
		<nav id={size+"-filter-pane"}>
			{size === "large" && (
				<div className={size+"-filter-pane-header"}>
					<h5>Filter Configuration:</h5>
				</div>
			)}
			<div className={size+"-filter-pane-content"}>
				<div className={size+"-filter-pane-component"}>
					<span>Related State:</span>
					<select
						className="form-control"
						value={filterConfigInForm.state}
						onChange={(event) => {
							setFilterConfigInForm({ ...filterConfigInForm, state: event.target.value })
						}}
					>
						<option value="ALL">All Gulf States</option>
						<option value="AL">Alabama</option>
						<option value="FL">Florida</option>
						<option value="LA">Louisiana</option>
						<option value="MS">Mississippi</option>
						<option value="TX">Texas</option>
						<option value="SE">Southeast Regional</option>
					</select>
				</div>
				<div className={size+"-filter-pane-component"}>
					<span>Time Frame:</span>
					<select
						className="form-control"
						value={filterConfigInForm.time}
						onChange={(event) => {
							setFilterConfigInForm({ ...filterConfigInForm, time: event.target.value })
						}}
					>
						<option value="All">All Time</option>
						<option value="5">Within 5 Years</option>
						<option value="10">Within 10 Years</option>
						<option value="10+">Older Than 10 Years</option>
					</select>
				</div>
				<div
					className={size+"-filter-pane-component"}
					value={filterConfigInForm.priority}
					onChange={(event) => {
						setFilterConfigInForm({ ...filterConfigInForm, priority: event.target.value })
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
				<div className={size+"-filter-pane-component"}>
					<Button
						variant="secondary"
						style={{ minWidth: "20%" }}
						onClick={() => onFilterConfigChange(filterConfigInForm)}
					>
						Apply Filter
					</Button>
				</div>
			</div>
		</nav>
	);
};

export default FilterPane;

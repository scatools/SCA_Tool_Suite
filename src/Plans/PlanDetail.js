import React, { useState, useEffect } from 'react';
import { Container, Jumbotron } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PlanDetail = () => {
	const [ tableDetail, setTableDetail ] = useState();
	let { planId } = useParams();

	useEffect(
		() => {
			const asyncFunc = async () => {
				const response = await axios.get(`https://sca-cpt-backend.herokuapp.com/plan/${planId}`);
				setTableDetail(response.data.data[0]);
			};
			asyncFunc();
		},
		[ planId ]
	);

	return (tableDetail ? <Container style={{marginTop: 10}}>
			<Jumbotron>
				<h3>{tableDetail.plan_name}</h3>
				<p className="lead">Agency Lead: {tableDetail.agency_lead}</p>
				<hr className="my-4" />
				<h4>Basic information:</h4>
				<ul style={{columnCount:2}}>
					<li>Plan Resolution: {tableDetail.plan_resolution}</li>
					<li>Planning Method: {tableDetail.planning_method}</li>
					<li>Plan Time Frame: {tableDetail.plan_timeframe}</li>
					<li>Geo Extent: {tableDetail.geo_extent}</li>
					<li>Planning Method: {tableDetail.planning_method}</li>
				</ul>

				<hr className="my-4" />
				<h4>Conservation method:</h4>
				<table className="table table-sm table-light">
					<thead>
						<tr>
							<th scope="col">Acquisition</th>
							<th scope="col">Easement</th>
							<th scope="col">Stewardship</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{tableDetail.acquisition}</td>
							<td>{tableDetail.easement}</td>
							<td>{tableDetail.stewardship}</td>
						</tr>
					</tbody>
				</table>
				<hr className="my-4" />
				<h4>RESTORE Goal Framework: </h4>
				<table className="table">
					<thead className="thead-light">
						<tr>
							<th scope="col">Goal</th>
							<th scope="col">Information</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Habitat</td>
							<td>{tableDetail.habitat}</td>
						</tr>
						<tr>
							<td>Water Quality</td>
							<td>{tableDetail.water_quality}</td>
						</tr>
						<tr>
							<td>Resources & Species</td>
							<td>{tableDetail.resources_species}</td>
						</tr>
						<tr>
							<td>Community Resilience</td>
							<td>{tableDetail.community_resilience}</td>
						</tr>
						<tr>
							<td>Ecosystem Resilience</td>
							<td>{tableDetail.ecosystem_resilience}</td>
						</tr>
						<tr>
							<td>Gulf Economy</td>
							<td>{tableDetail.gulf_economy}</td>
						</tr>
					</tbody>
				</table>
				<a
					className="btn btn-primary btn-lg"
					href={
						tableDetail.plan_url.includes('static/assets/') ? (
							`https://s3.amazonaws.com/planinventory/${tableDetail.plan_url}`
						) : (
							tableDetail.plan_url
						)
					}
				>
					Raw Document
				</a>
				<hr className="my-2" />
				<div className="embed-responsive embed-responsive-16by9">
					<iframe
						className="embed-responsive-item"
						src={`https://s3.amazonaws.com/planinventory/static/assets2/ref${Number(tableDetail.id)-1}.pdf`}
						allowFullScreen
					/>
				</div>
			</Jumbotron>
		</Container> : <div>loading</div>
	);
};

export default PlanDetail;

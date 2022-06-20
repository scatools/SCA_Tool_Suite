import React from 'react';
import { usePagination, DOTS } from '../Helper/usePagination';
import { Pagination } from 'react-bootstrap';

const CustomPagination = (props) => {
	const { onPageChange, totalCount, siblingCount = 1, currentPage, pageSize = 10 } = props;

	const paginationRange = usePagination({
		currentPage,
		totalCount,
		siblingCount,
		pageSize
	});

	if (currentPage === 0 || paginationRange.length < 2) {
		return null;
	}

	const onNext = () => {
		onPageChange(currentPage + 1);
	};

	const onPrevious = () => {
		onPageChange(currentPage - 1);
	};

	let lastPage = paginationRange[paginationRange.length - 1];
	return (
		<div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
			<Pagination>
				<Pagination.First disabled={currentPage === 1} onClick={() => onPageChange(1)} />
				<Pagination.Prev disabled={currentPage === 1} onClick={onPrevious} />
				{paginationRange.map((pageNumber, index) => {
					if (pageNumber === DOTS) {
						return <Pagination.Ellipsis key={index}/>;
					}

					return (
						<Pagination.Item key={index} active={pageNumber === currentPage} onClick={() => onPageChange(pageNumber)}>
							{pageNumber}
						</Pagination.Item>
					);
				})}
				<Pagination.Next disabled={currentPage === lastPage} onClick={onNext} />
				<Pagination.Last disabled={currentPage === lastPage} onClick={() => onPageChange(lastPage)} />
			</Pagination>
		</div>
	);
};

export default CustomPagination;

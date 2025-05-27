import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getStoreDataRoute } from '../APIRoutes';
import '../CSS/StoreAnalysis.css';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from 'recharts';

const COLORS = [
    '#28a745', '#007bff', '#6f42c1', '#fd7e14', '#dc3545',
    '#17a2b8', '#ffc107', '#6610f2', '#20c997', '#6c757d',
];

function StoreAnalysis() {
    const [data, setData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedCenter, setSelectedCenter] = useState('All');
    const [months, setMonths] = useState([]);

    useEffect(() => {
        axios
            .get(getStoreDataRoute)
            .then((response) => {
                if (response.data.status) {
                    const fetchedData = response.data.data;
                    setData(fetchedData);

                    // Dynamically extract months from the data
                    const monthsInData = ['All', ...new Set(
                        fetchedData.flatMap(item => Object.keys(item.MonthWiseRevenueGenerated || {}))
                    )];
                    setMonths(monthsInData);

                    // Set the default selected month to the first available month (except 'All')
                    setSelectedMonth(monthsInData[1] || 'All');
                }
            })
            .catch((err) => {
                console.error('Error fetching data:', err);
            });
    }, []);

    const filteredData =
        selectedCenter === 'All'
            ? data
            : data.filter((item) => item.CenterName === selectedCenter);

    const totalSummary = filteredData.reduce(
        (acc, item) => {
            if (selectedMonth === 'All') {
                Object.keys(item.MonthWiseRevenueGenerated || {}).forEach((month) => {
                    acc.revenue += item.MonthWiseRevenueGenerated[month] || 0;
                    acc.collected += item.MonthWiseAmountCollected[month] || 0;
                    acc.royalty += item.RoyaltyMonthWise[month] || 0;
                    acc.received += item.AmountReceivedMonthWise[month] || 0;
                });
                acc.due += item.TotalAmountDue || 0;
            } else {
                const revenue = item.MonthWiseRevenueGenerated?.[selectedMonth] || 0;
                const collected = item.MonthWiseAmountCollected?.[selectedMonth] || 0;
                const royalty = item.RoyaltyMonthWise?.[selectedMonth] || 0;
                const received = item.AmountReceivedMonthWise?.[selectedMonth] || 0;
                const due = item.TotalAmountDue || 0;

                acc.revenue += revenue;
                acc.collected += collected;
                acc.royalty += royalty;
                acc.received += received;
                acc.due += due;
            }

            return acc;
        },
        { revenue: 0, collected: 0, royalty: 0, received: 0, due: 0 }
    );

    const centers = ['All', ...new Set(data.map((item) => item.CenterName))];

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);

    // ✅ Bar chart always shows dynamic months from the data
    const chartData = filteredData.map((item) => {
        const monthData = months.slice(1).reduce((acc, month) => {
            acc[`${month}Revenue`] = item.MonthWiseRevenueGenerated?.[month] || 0;
            return acc;
        }, { name: item.CenterName });

        return monthData;
    });

    const pieData = [
        { name: 'Received', value: totalSummary.received },
        { name: 'Due', value: totalSummary.due },
    ];

    const royaltyPieData = selectedMonth === 'All'
        ? filteredData.flatMap((item) =>
            months.slice(1).map((month) => ({
                name: `${item.CenterName} - ${month}`,
                value: item.RoyaltyMonthWise?.[month] || 0,
            }))
        )
        : filteredData.map((item) => ({
            name: item.CenterName,
            value: item.RoyaltyMonthWise?.[selectedMonth] || 0,
        }));

    return (
        <div className="analysis-dashboard">
            <div className="filters-container">
                <div className="filter-group">
                    <label>Month:</label>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                        {months.map((month) => (
                            <option key={month} value={month}>
                                {month}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Center:</label>
                    <select
                        value={selectedCenter}
                        onChange={(e) => setSelectedCenter(e.target.value)}
                    >
                        {centers.map((center) => (
                            <option key={center} value={center}>
                                {center}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="summary-cards">
                <div className="summary-card revenue">
                    <h4>Total Revenue</h4>
                    <p className="value">{formatCurrency(totalSummary.revenue)}</p>
                </div>
                <div className="summary-card collected">
                    <h4>Total Collected</h4>
                    <p className="value">{formatCurrency(totalSummary.collected)}</p>
                </div>
                <div className="summary-card royalty">
                    <h4>Total Royalty</h4>
                    <p className="value">{formatCurrency(totalSummary.royalty)}</p>
                </div>
                <div className="summary-card received">
                    <h4>Total Received</h4>
                    <p className="value">{formatCurrency(totalSummary.received)}</p>
                </div>
                <div className="summary-card due">
                    <h4>Total Due</h4>
                    <p className="value">{formatCurrency(totalSummary.due)}</p>
                </div>
            </div>

            <div className="metrics-charts-container">
                {/* Bar Chart */}
                <div className="bar-chart-wrapper" style={{ marginBottom: '2rem' }}>
                    <h3>Center-wise Revenue Breakdown ({months.slice(1).join('–')})</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                            <YAxis />
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                            <Legend />
                            {months.slice(1).map((month, index) => (
                                <Bar
                                    key={`${month}Revenue`}
                                    dataKey={`${month}Revenue`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Combined Pie Charts Block */}
                <div className="pie-charts-group" style={{ display: 'flex', gap: '2rem', justifyContent: 'space-between' }}>
                    {/* Pie 1 - Received vs Due */}
                    <div className="pie-chart-wrapper" style={{ flex: 1 }}>
                        <h3>Pending vs Received Payment ({selectedMonth})</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Pie 2 - Royalty Distribution */}
                    <div className="pie-chart-wrapper" style={{ flex: 1 }}>
                        <h3>Royalty Distribution ({selectedMonth})</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={royaltyPieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                >
                                    {royaltyPieData.map((entry, index) => (
                                        <Cell key={`cell-royalty-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StoreAnalysis;

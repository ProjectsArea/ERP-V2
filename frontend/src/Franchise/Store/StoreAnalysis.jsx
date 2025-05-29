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
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedCenter, setSelectedCenter] = useState('All');
    const [months, setMonths] = useState([]);
    const [years, setYears] = useState([]);

    useEffect(() => {
        axios
            .get(getStoreDataRoute)
            .then((response) => {
                if (response.data.status) {
                    const fetchedData = response.data.data;
                    setData(fetchedData);

                    // Extract months dynamically from data keys (like "Jan-2023")
                    const monthYearKeys = fetchedData.flatMap(item =>
                        Object.keys(item.MonthWiseRevenueGenerated || {})
                    );

                    // Parse months and years separately
                    const monthsSet = new Set();
                    const yearsSet = new Set();

                    monthYearKeys.forEach(key => {
                        const [month, year] = key.split('-');
                        monthsSet.add(month);
                        yearsSet.add(year);
                    });

                    // Sort months based on your known order
                    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const sortedMonths = Array.from(monthsSet).sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));

                    // Sort years ascending
                    const sortedYears = Array.from(yearsSet).sort();

                    // Add 'All' option at start
                    setMonths(['All', ...sortedMonths]);
                    setYears(['All', ...sortedYears]);

                    // Set defaults
                    setSelectedMonth('All');
                    setSelectedYear('All');
                }
            })
            .catch((err) => {
                console.error('Error fetching data:', err);
            });
    }, []);

    // Filter data based on Center, Year, and Month
    const filteredData = data.filter(item => {
        if (selectedCenter !== 'All' && item.CenterName !== selectedCenter) return false;

        if (selectedYear === 'All' && selectedMonth === 'All') return true;

        // Check if item has data for selected year/month
        const keys = Object.keys(item.MonthWiseRevenueGenerated || {});

        return keys.some(key => {
            const [month, year] = key.split('-');

            if (selectedYear !== 'All' && year !== selectedYear) return false;
            if (selectedMonth !== 'All' && month !== selectedMonth) return false;
            return true;
        });
    });

    // Aggregate totals for summary cards
    const totalSummary = filteredData.reduce(
        (acc, item) => {
            // Filter keys according to selected month/year
            const keys = Object.keys(item.MonthWiseRevenueGenerated || {}).filter(key => {
                const [month, year] = key.split('-');
                if (selectedYear !== 'All' && year !== selectedYear) return false;
                if (selectedMonth !== 'All' && month !== selectedMonth) return false;
                return true;
            });

            if (keys.length === 0 && selectedMonth === 'All' && selectedYear === 'All') {
                // Include all months and years if "All" selected
                Object.keys(item.MonthWiseRevenueGenerated || {}).forEach(monthYearKey => {
                    acc.revenue += item.MonthWiseRevenueGenerated[monthYearKey] || 0;
                    acc.collected += item.MonthWiseAmountCollected[monthYearKey] || 0;
                    acc.royalty += item.RoyaltyMonthWise[monthYearKey] || 0;
                    acc.received += item.AmountReceivedMonthWise[monthYearKey] || 0;
                });
                acc.due += item.TotalAmountDue || 0;
            } else {
                keys.forEach(key => {
                    acc.revenue += item.MonthWiseRevenueGenerated[key] || 0;
                    acc.collected += item.MonthWiseAmountCollected[key] || 0;
                    acc.royalty += item.RoyaltyMonthWise[key] || 0;
                    acc.received += item.AmountReceivedMonthWise[key] || 0;
                });
                acc.due += item.TotalAmountDue || 0;
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

    // Prepare data for BarChart
    // For each center, prepare revenue per selected months & years
    const chartData = filteredData.map(item => {
        // Accumulate revenue by months (filtered by selectedYear)
        const monthData = {};

        months.forEach(month => {
            if (month === 'All') return;
            const key = `${month}-${selectedYear === 'All' ? '' : selectedYear}`;
            if (selectedYear === 'All') {
                // Sum across all years for this month
                const sumForMonth = Object.entries(item.MonthWiseRevenueGenerated || {})
                    .filter(([k]) => k.startsWith(month + '-'))
                    .reduce((sum, [, val]) => sum + val, 0);
                monthData[`${month}Revenue`] = sumForMonth;
            } else {
                monthData[`${month}Revenue`] = item.MonthWiseRevenueGenerated?.[key] || 0;
            }
        });

        return {
            name: item.CenterName,
            ...monthData,
        };
    });

    // Pie data for Received vs Due
    const pieData = [
        { name: 'Received', value: totalSummary.received },
        { name: 'Due', value: totalSummary.due },
    ];

    // Pie data for royalty distribution
    let royaltyPieData = [];

    if (selectedMonth === 'All' && selectedYear === 'All') {
        royaltyPieData = filteredData.flatMap(item =>
            Object.entries(item.RoyaltyMonthWise || {})
                .map(([monthYearKey, value]) => ({
                    name: `${item.CenterName} - ${monthYearKey}`,
                    value,
                }))
        );
    } else if (selectedMonth === 'All' && selectedYear !== 'All') {
        // Sum all months for selected year
        royaltyPieData = filteredData.map(item => {
            const sumForYear = Object.entries(item.RoyaltyMonthWise || {})
                .filter(([key]) => key.endsWith(`-${selectedYear}`))
                .reduce((sum, [, val]) => sum + val, 0);
            return {
                name: item.CenterName,
                value: sumForYear,
            };
        });
    } else if (selectedMonth !== 'All' && selectedYear === 'All') {
        // Sum all years for selected month
        royaltyPieData = filteredData.map(item => {
            const sumForMonth = Object.entries(item.RoyaltyMonthWise || {})
                .filter(([key]) => key.startsWith(selectedMonth + '-'))
                .reduce((sum, [, val]) => sum + val, 0);
            return {
                name: item.CenterName,
                value: sumForMonth,
            };
        });
    } else {
        // Specific month and year
        const key = `${selectedMonth}-${selectedYear}`;
        royaltyPieData = filteredData.map(item => ({
            name: item.CenterName,
            value: item.RoyaltyMonthWise?.[key] || 0,
        }));
    }

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
                    <label>Year:</label>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
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
                    <h3>Center-wise Revenue Breakdown ({selectedYear === 'All' ? 'All Years' : selectedYear})</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                            <YAxis />
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                            <Legend />
                            {months
                                .filter(m => m !== 'All')
                                .map((month, index) => (
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
                    <div className="pie-chart-wrapper" style={{ flex: 1, maxWidth: 400 }}>
                        <h3>Received vs Due</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    label
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Pie 2 - Royalty Distribution */}
                    <div className="pie-chart-wrapper" style={{ flex: 1, maxWidth: 400 }}>
                        <h3>Royalty Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={royaltyPieData.filter(d => d.value > 0)}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label={(entry) => entry.name}
                                >
                                    {royaltyPieData.map((entry, index) => (
                                        <Cell
                                            key={`cell-royalty-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
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

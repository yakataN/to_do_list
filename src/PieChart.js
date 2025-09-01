import React from 'react';

export default function PieChart({ data }) {
	// 円グラフの中心・半径
	const cx = 50, cy = 50, r = 40;
	const total = data.reduce((sum, d) => sum + d.value, 0);
	let startAngle = 0;

	// value割合で扇形パスを生成
	const paths = data.map((d, i) => {
		const angle = (d.value / total) * 2 * Math.PI;
		const endAngle = startAngle + angle;
		// 円周上の座標計算
		const x1 = cx + r * Math.cos(startAngle - Math.PI / 2);
		const y1 = cy + r * Math.sin(startAngle - Math.PI / 2);
		const x2 = cx + r * Math.cos(endAngle - Math.PI / 2);
		const y2 = cy + r * Math.sin(endAngle - Math.PI / 2);
		// 大きい扇形かどうか
		const largeArcFlag = angle > Math.PI ? 1 : 0;
		// SVGパス
		const path = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArcFlag},1 ${x2},${y2} Z`;
		startAngle = endAngle;
		return <path key={i} d={path} fill={d.color} />;
	});

	return (
		<svg width="100" height="100" viewBox="0 0 100 100">
			<circle cx={cx} cy={cy} r={r} fill="#eee" />
			{paths}
		</svg>
	);
}

import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const DashboardCharts = ({ trends, buildings }) => (
  <div className="grid gap-6 xl:grid-cols-2">
    <article className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-xl">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-100">Monthly trend</p>
      <h3 className="mt-2 text-2xl font-semibold text-white">Violation momentum</h3>
      <div className="mt-6 h-72">
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={trends}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
            <XAxis dataKey="label" stroke="#94a3b8" />
            <YAxis allowDecimals={false} stroke="#94a3b8" />
            <Tooltip />
            <Line dataKey="count" stroke="#35d5a0" strokeWidth={3} type="monotone" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </article>

    <article className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-xl">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-100">Buildings</p>
      <h3 className="mt-2 text-2xl font-semibold text-white">Performance by building</h3>
      <div className="mt-6 h-72">
        <ResponsiveContainer height="100%" width="100%">
          <BarChart data={buildings}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
            <XAxis dataKey="_id" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="avgScore" radius={[14, 14, 0, 0]}>
              {buildings.map((item) => (
                <Cell fill={item.avgScore >= 90 ? "#35d5a0" : item.avgScore >= 75 ? "#fbbf24" : "#fb7185"} key={item._id} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  </div>
);

export default DashboardCharts;

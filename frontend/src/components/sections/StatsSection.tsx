import { Icons, IconComponent } from "@/components/icons/Icons";

interface StatItemProps {
  icon: IconComponent;
  num: string;
  label: string;
}

function StatItem({ icon: Ico, num, label }: StatItemProps) {
  return (
    <div className="stat">
      <div className="ico">
        <Ico />
      </div>
      <div>
        <div className="num">{num}</div>
        <div
          className="lab"
          dangerouslySetInnerHTML={{ __html: label }}
        />
      </div>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section style={{ paddingBottom: 48 }}>
      <div className="container">
        <div className="stats">
          <StatItem icon={Icons.users}   num="40+"  label="Happy Clients<br/>Worldwide" />
          <StatItem icon={Icons.rocket}  num="40+"  label="Projects<br/>Delivered" />
          <StatItem icon={Icons.star}    num="98%"  label="Client<br/>Satisfaction" />
          <StatItem icon={Icons.headset} num="24/7" label="Support &amp;<br/>Reliability" />
        </div>
      </div>
    </section>
  );
}

function HomePage(){
    return(
        <div>
            <h1>Home Page</h1>
        </div>
    )
}
export default HomePage;
// import React, { useState } from "react";
// import {
//   Eye,
//   EyeOff,
//   CreditCard,
//   PiggyBank,
//   TrendingUp,
//   Shield,
//   Bell,
//   User,
//   ChevronRight,
//   Award,
//   Zap,
//   Globe,
// } from "lucide-react";
// import styles from "./Homepage.module.css";

// export default function Homepage() {
//   const [balanceVisible, setBalanceVisible] = useState(true);
//   const balance = "₹12,45,680.50";

//   return (
//     <div className={styles.page}>
//       {/* Header */}
//       <header className={styles.header}>
//         <div className={styles.headerInner}>
//           <div className={styles.logo}>
//             <Zap />
//             <span>NexBank</span>
//           </div>
//           <div className={styles.headerIcons}>
//             <button className={styles.iconBtn}>
//               <Bell />
//               <span className={styles.dot}></span>
//             </button>
//             <button className={styles.iconBtn}>
//               <User />
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className={styles.container}>
//         {/* Welcome */}
//         <div className={styles.welcome}>
//           <h1>Welcome back, Priya!</h1>
//           <p>Here's your financial overview</p>
//         </div>

//         {/* Balance Card */}
//         <div className={styles.balanceCard}>
//           <div className={styles.balanceTop}>
//             <div>
//               <p>Total Balance</p>
//               <div className={styles.balanceRow}>
//                 <h2>{balanceVisible ? balance : "₹••••••••"}</h2>
//                 <button
//                   onClick={() => setBalanceVisible(!balanceVisible)}
//                   className={styles.eyeBtn}
//                 >
//                   {balanceVisible ? <Eye /> : <EyeOff />}
//                 </button>
//               </div>
//             </div>
//             <span className={styles.growth}>+12.5%</span>
//           </div>

//           <div className={styles.balanceStats}>
//             <div>
//               <p>Savings</p>
//               <h4>₹8,45,230</h4>
//             </div>
//             <div>
//               <p>Investments</p>
//               <h4>₹4,00,450</h4>
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <section>
//           <h3 className={styles.sectionTitle}>Quick Actions</h3>
//           <div className={styles.actions}>
//             <Action icon={<CreditCard />} title="Cards" desc="Manage cards" />
//             <Action icon={<PiggyBank />} title="Savings" desc="Create goals" />
//             <Action icon={<TrendingUp />} title="Invest" desc="Grow wealth" />
//             <Action icon={<Shield />} title="Insurance" desc="Stay protected" />
//           </div>
//         </section>

//         {/* Feature Cards */}
//         <div className={styles.features}>
//           <Feature icon={<Award />} title="Rewards" desc="2,450 points to redeem" />
//           <Feature icon={<TrendingUp />} title="Credit Score" desc="785 • Excellent" />
//           <Feature icon={<Globe />} title="Global Services" desc="Send money worldwide" />
//         </div>
//       </main>
//     </div>
//   );
// }

// function Action({ icon, title, desc }) {
//   return (
//     <button className={styles.actionCard}>
//       <div className={styles.actionIcon}>{icon}</div>
//       <h4>{title}</h4>
//       <p>{desc}</p>
//     </button>
//   );
// }

// function Feature({ icon, title, desc }) {
//   return (
//     <div className={styles.featureCard}>
//       <div className={styles.featureTop}>
//         <div className={styles.featureIcon}>{icon}</div>
//         <ChevronRight />
//       </div>
//       <h4>{title}</h4>
//       <p>{desc}</p>
//     </div>
//   );
// }

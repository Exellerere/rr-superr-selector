/**
 * RR SupeRR Selector — IPL 2027 Scouting & Auction Engine
 * Decoupled Data Store
 * 
 * --------------------------------------------------------------------------
 * HOW TO SWAP WITH YOUR REAL CSV / JSON DATASET:
 * 1. Export your Python / R scouting model output to JSON or CSV.
 * 2. Ensure each player object adheres to the `Player` interface below.
 * 3. Replace the `UNCAPPED_PLAYERS` array with your parsed records or load
 *    from an external API route (`/api/players`).
 * 4. Adjust the weights in `SCORING_METHODOLOGY` if your machine learning
 *    pipeline uses custom hyperparameters.
 * --------------------------------------------------------------------------
 */

export type PlayerRole = 'Top-Order Batter' | 'Middle-Order Finisher' | 'All-Rounder' | 'Wicketkeeper-Batter' | 'Pace Bowler' | 'Wrist Spinner' | 'Finger Spinner';

export interface PlayerMetric {
  label: string;
  value: number; // 0 to 100
  benchmark: number; // average uncapped benchmark
}

export interface PlayerMatchHighlight {
  match: string;
  tournament: string;
  performance: string;
  context: string;
}

export interface ScoutingReport {
  analystSummary: string;
  technicalStrengths: string[];
  areasOfDevelopment: string[];
  rajasthanRoyalsFit: string;
  projectedRole: string;
  metricsRadar: PlayerMetric[];
  recentHighlights: PlayerMatchHighlight[];
  scoutRating: number; // out of 10
}

export interface Player {
  id: string;
  rank: number;
  name: string;
  age: number;
  role: PlayerRole;
  domesticTeam: string;
  battingStyle: string;
  bowlingStyle?: string;
  matchesPlayed: number;
  
  // Batting / Bowling core numbers
  runsOrWickets: string; // e.g. "482 Runs" or "22 Wickets"
  strikeRateOrEconomy: number; // Strike Rate for batters (e.g. 168.4) or Economy for bowlers (e.g. 7.15)
  boundaryPercentage: number; // % of runs in boundaries or boundary balls conceded %
  deathPowerplayStat: string; // e.g. "Death SR: 204.8" or "PP Econ: 6.20"
  
  // Analytics & Machine Learning Model Scores
  clutchPressureRating: number; // 0 - 100 Pressure Index Score
  winProbabilityAdded: number; // WPA per match
  dotBallPressureRatio: number; // %
  recommendedMaxBid: number; // in INR Crores (₹ Cr)
  basePrice: number; // in INR Crores (₹ Cr), typically 0.20 or 0.30 Cr
  
  // Squad gap tagging
  primaryGapCovered: 'Finisher & Death Power' | 'Domestic Death Pacer' | 'Mystery Wrist Spinner' | 'Middle-Order Anchor/Rotator' | 'Powerplay Exploiter' | 'Dynamic Wicketkeeper';
  
  // Deep Scouting Dossier
  scoutingReport: ScoutingReport;
}

export interface SquadGap {
  roleCategory: string;
  currentStrength: number; // 0 - 100
  urgencyLevel: 'Critical' | 'High' | 'Moderate';
  targetCount: number;
  shortlistedCount: number;
  description: string;
  idealProfile: string;
}

export interface ExecutiveKPIs {
  totalDomesticPlayersAnalyzed: number;
  shortlistCount: number;
  avgPressureImpactScore: number;
  targetAuctionPurseAllocation: number; // ₹ Cr
  totalPurseBudget: number; // ₹ Cr (RR total auction purse)
  historicalRetentionCount: number;
  overseasSlotsRemaining: number;
  totalSlotsRemaining: number;
}

export const EXECUTIVE_KPIS: ExecutiveKPIs = {
  totalDomesticPlayersAnalyzed: 842,
  shortlistCount: 10,
  avgPressureImpactScore: 89.6,
  targetAuctionPurseAllocation: 16.80,
  totalPurseBudget: 34.50,
  historicalRetentionCount: 15,
  overseasSlotsRemaining: 3,
  totalSlotsRemaining: 8,
};

export const SQUAD_GAPS: SquadGap[] = [
  {
    roleCategory: 'Finisher & Death Power',
    currentStrength: 52,
    urgencyLevel: 'Critical',
    targetCount: 2,
    shortlistedCount: 3,
    description: 'Post-Shimron Hetmyer acceleration depth. Need domestic power hitters capable of striking 190+ from ball 1 in overs 16-20.',
    idealProfile: 'Right-handed or left-handed brute with bat speed > 135 km/h and high boundary rate against high-pace hard lengths.'
  },
  {
    roleCategory: 'Domestic Death Pacer',
    currentStrength: 46,
    urgencyLevel: 'Critical',
    targetCount: 2,
    shortlistedCount: 2,
    description: 'Death overs specialist bowling accurate wide yorkers and slow dipping off-cutters at the Sawai Mansingh Stadium.',
    idealProfile: '140+ kph bowler with pinpoint yorker execution (>35% yorker frequency in death overs) under pressure.'
  },
  {
    roleCategory: 'Mystery Wrist Spinner',
    currentStrength: 64,
    urgencyLevel: 'High',
    targetCount: 1,
    shortlistedCount: 2,
    description: 'Long-term succession plan for Yuzvendra Chahal/Ashwin archetype. Must attack middle overs (7-15) on Jaipur track.',
    idealProfile: 'Aggressive googly/slider bowler with deception against LHB and sub-7.50 economy when batsmen are charging.'
  },
  {
    roleCategory: 'Middle-Order Anchor/Rotator',
    currentStrength: 72,
    urgencyLevel: 'Moderate',
    targetCount: 1,
    shortlistedCount: 1,
    description: 'Stabilizer for 20/3 collapse scenarios who rotates strike against spin at 135+ SR without consuming dot balls.',
    idealProfile: 'Technically sound stroke-maker with low dot-ball % (<28%) against finger spin.'
  },
  {
    roleCategory: 'Dynamic Wicketkeeper',
    currentStrength: 68,
    urgencyLevel: 'Moderate',
    targetCount: 1,
    shortlistedCount: 1,
    description: 'Backup gloveman behind Sanju Samson with versatile entry point (3 to 6) and 360-degree sweep capability.',
    idealProfile: 'Agile keeper with swift stumping reflexes and innovative lap/ramp shots against express pace.'
  },
  {
    roleCategory: 'Powerplay Exploiter',
    currentStrength: 78,
    urgencyLevel: 'Moderate',
    targetCount: 1,
    shortlistedCount: 1,
    description: 'High-intent boundary seeker who clears infield during first 6 overs to maximize field restrictions.',
    idealProfile: 'Fearless opener with 160+ PP strike rate and dominant pull shot against short pitched bowling.'
  }
];

export const UNCAPPED_PLAYERS: Player[] = [
  {
    id: 'rr-scout-01',
    rank: 1,
    name: 'Priyansh Arya',
    age: 23,
    role: 'Top-Order Batter',
    domesticTeam: 'Delhi / DPL',
    battingStyle: 'Left-Hand Bat',
    matchesPlayed: 24,
    runsOrWickets: '812 Runs',
    strikeRateOrEconomy: 174.2,
    boundaryPercentage: 74.8,
    deathPowerplayStat: 'PP SR: 182.6',
    clutchPressureRating: 94.8,
    winProbabilityAdded: 0.28,
    dotBallPressureRatio: 21.4,
    recommendedMaxBid: 4.80,
    basePrice: 0.30,
    primaryGapCovered: 'Powerplay Exploiter',
    scoutingReport: {
      analystSummary: 'Explosive left-handed opener who dismantled top domestic bowling attacks in the Delhi Premier League and SMAT. Possesses devastating bat swing through the line and scored six sixes in an over. Perfectly matches Rajasthan Royals aggressive intent philosophy at the top alongside Jaiswal and Samson.',
      technicalStrengths: [
        'Elite bat speed against 140+ kph express pace with quick front-foot transfer',
        'Exceptional boundary percentage (74.8% of runs scored in boundaries)',
        'Extremely low dot-ball percentage in field-restriction powerplay overs (21.4%)',
        'Strong back-foot weight transfer to demolish short ball over mid-wicket'
      ],
      areasOfDevelopment: [
        'Vulnerability to sharp incoming inswingers from left-arm quicks in the first 6 balls',
        'Patience against disciplined wide-line spin traps outside off-stump'
      ],
      rajasthanRoyalsFit: 'Provides a like-for-like southpaw fireworks option. Can open or float at #3 to maintain ultra-high run-rates at Sawai Mansingh Stadium.',
      projectedRole: 'Enforcer Opener / Dynamic Powerplay Striker',
      scoutRating: 9.6,
      metricsRadar: [
        { label: 'Powerplay Strike Rate', value: 95, benchmark: 68 },
        { label: 'Boundary Frequency', value: 94, benchmark: 62 },
        { label: 'High-Pace Dominance', value: 91, benchmark: 59 },
        { label: 'Pressure Index (WPA)', value: 95, benchmark: 65 },
        { label: 'Dot Ball Suppression', value: 89, benchmark: 60 }
      ],
      recentHighlights: [
        {
          match: 'South Delhi vs North Delhi',
          tournament: 'Delhi Premier League 2024',
          performance: '120 (50 balls) - 10 fours, 10 sixes (6 sixes in one over)',
          context: 'Chasing 200+ under scoreboard pressure; achieved 6 sixes in the 12th over.'
        },
        {
          match: 'Delhi vs Uttar Pradesh',
          tournament: 'Syed Mushtaq Ali Trophy',
          performance: '68* (34 balls) vs Shivam Mavi & Yash Dayal',
          context: 'Chased target of 178 with 2 overs to spare.'
        }
      ]
    }
  },
  {
    id: 'rr-scout-02',
    rank: 2,
    name: 'Sameer Rizvi',
    age: 21,
    role: 'Middle-Order Finisher',
    domesticTeam: 'Uttar Pradesh',
    battingStyle: 'Right-Hand Bat',
    bowlingStyle: 'Right-Arm Offbreak',
    matchesPlayed: 28,
    runsOrWickets: '740 Runs',
    strikeRateOrEconomy: 164.8,
    boundaryPercentage: 68.2,
    deathPowerplayStat: 'Death SR: 206.4',
    clutchPressureRating: 93.2,
    winProbabilityAdded: 0.25,
    dotBallPressureRatio: 24.1,
    recommendedMaxBid: 4.20,
    basePrice: 0.30,
    primaryGapCovered: 'Finisher & Death Power',
    scoutingReport: {
      analystSummary: 'One of the premier clean hitters of spin in Indian domestic cricket. Rizvi strikes spin at an astonishing 178.5 and clears 80-meter boundaries with pure core torque and extension. Has tested high in our pressure leverage simulator when entering at 4 down.',
      technicalStrengths: [
        'Monster hitting arc between long-off and deep mid-wicket',
        'Exceptional back-foot elevation against slow left-arm orthodox',
        'Cold-blooded temperament in required run-rate 12+ chases',
        'Capable off-spin utility bowler in match-ups against left-handers'
      ],
      areasOfDevelopment: [
        'Short-pitch chest-height bouncers directed at right armpit',
        'Needs sharper running between wickets to convert 1s into 2s'
      ],
      rajasthanRoyalsFit: 'Solves RR chronic death over finishing dependency. Can bat at #5 or #6 and pair with Shimron Hetmyer or Dhruv Jurel.',
      projectedRole: 'Designated Spin Destroyer & Death Finisher',
      scoutRating: 9.4,
      metricsRadar: [
        { label: 'Death Overs SR', value: 96, benchmark: 66 },
        { label: 'Spin Assault Index', value: 98, benchmark: 64 },
        { label: 'Boundary Frequency', value: 88, benchmark: 62 },
        { label: 'Pressure Index (WPA)', value: 93, benchmark: 65 },
        { label: 'Dot Ball Suppression', value: 82, benchmark: 60 }
      ],
      recentHighlights: [
        {
          match: 'UP vs Tamil Nadu',
          tournament: 'Syed Mushtaq Ali Quarter-Final',
          performance: '54* (22 balls) with 6 sixes against Varun C & Sai Kishore',
          context: 'Came in at 84/4 requiring 88 off 38 deliveries; won with 3 balls left.'
        },
        {
          match: 'UP vs Karnataka',
          tournament: 'Vijay Hazare Trophy',
          performance: '89 (58 balls) finishing innings at death',
          context: 'Elevated team total from 210 to 318 in final 10 overs.'
        }
      ]
    }
  },
  {
    id: 'rr-scout-03',
    rank: 3,
    name: 'Rasikh Salam Dar',
    age: 24,
    role: 'Pace Bowler',
    domesticTeam: 'Jammu & Kashmir',
    battingStyle: 'Right-Hand Bat',
    bowlingStyle: 'Right-Arm Fast-Medium',
    matchesPlayed: 31,
    runsOrWickets: '42 Wickets',
    strikeRateOrEconomy: 7.42,
    boundaryPercentage: 14.2,
    deathPowerplayStat: 'Death Econ: 8.35',
    clutchPressureRating: 92.6,
    winProbabilityAdded: 0.26,
    dotBallPressureRatio: 48.6,
    recommendedMaxBid: 3.80,
    basePrice: 0.30,
    primaryGapCovered: 'Domestic Death Pacer',
    scoutingReport: {
      analystSummary: 'Highly evolved death and middle-overs pacer with a repertoire of deception. Bowls knuckle balls, back-of-the-hand slower balls, and skiddy 138 kph yorkers with minimal change in arm action. Outstanding boundary prevention metrics in high-leverage situations.',
      technicalStrengths: [
        'Superb slow dipping yorker with sudden late drift',
        'High release angle making cutters grip even on true surfaces',
        'Tactical awareness to bowl to wide long-boundary dimensions',
        'Capable of taking wickets in clusters under pressure'
      ],
      areasOfDevelopment: [
        'Control of line when batsmen move deep in crease',
        'Fitness workload management across long 14-game campaigns'
      ],
      rajasthanRoyalsFit: 'Offers RR the Indian death-bowling partner for Sandeep Sharma and Trent Boult, preventing the need to spend an overseas slot on a specialist death seamer.',
      projectedRole: 'Middle & Death Specialist / Enforcer Seamer',
      scoutRating: 9.3,
      metricsRadar: [
        { label: 'Death Overs Economy', value: 92, benchmark: 60 },
        { label: 'Dot Ball Pressure', value: 93, benchmark: 63 },
        { label: 'Yorker Accuracy', value: 91, benchmark: 58 },
        { label: 'Pressure Index (WPA)', value: 93, benchmark: 65 },
        { label: 'Clutch Wicket Rate', value: 90, benchmark: 61 }
      ],
      recentHighlights: [
        {
          match: 'J&K vs Punjab',
          tournament: 'Syed Mushtaq Ali Super League',
          performance: '4/19 (4 overs) including 2 wickets in 19th over',
          context: 'Defended 14 runs off the penultimate over against Shubman Gill led side.'
        },
        {
          match: 'J&K vs Baroda',
          tournament: 'Ranji Trophy / White Ball Trials',
          performance: '3/24 (4 overs) with 14 dot balls',
          context: 'Bowled overs 16, 18, and 20 conceding just 17 runs.'
        }
      ]
    }
  },
  {
    id: 'rr-scout-04',
    rank: 4,
    name: 'Vipraj Nigam',
    age: 21,
    role: 'Wrist Spinner',
    domesticTeam: 'Uttar Pradesh',
    battingStyle: 'Right-Hand Bat',
    bowlingStyle: 'Right-Arm Legbreak / Googly',
    matchesPlayed: 18,
    runsOrWickets: '29 Wickets',
    strikeRateOrEconomy: 6.85,
    boundaryPercentage: 12.8,
    deathPowerplayStat: 'Middle Econ: 6.50',
    clutchPressureRating: 91.5,
    winProbabilityAdded: 0.23,
    dotBallPressureRatio: 52.3,
    recommendedMaxBid: 3.20,
    basePrice: 0.20,
    primaryGapCovered: 'Mystery Wrist Spinner',
    scoutingReport: {
      analystSummary: 'Tall, quick-through-the-air leg spinner who gets extreme bounce and skid off length. Possesses a hard-to-pick googly with very subtle wrist seam tilt. In domestic tracking, right-handers average just 14.2 against his wrong-un.',
      technicalStrengths: [
        'Bowls between 94-101 kph, preventing batters from stepping out',
        'Sharp bounce from a high 2.1m release height',
        'Over 52% dot balls bowled in middle overs (7-15)',
        'Extremely disciplined trajectory targeting stumps'
      ],
      areasOfDevelopment: [
        'Can occasionally leak full tosses when trying to bowl too flat',
        'Needs more variation in loop and flight when pitch is slow'
      ],
      rajasthanRoyalsFit: 'Provides Jaipur track bite and aggression. Natural successor archetype to maintain Rajasthan dominance in spin overs.',
      projectedRole: 'Attacking Middle-Overs Enforcer & Googly Specialist',
      scoutRating: 9.1,
      metricsRadar: [
        { label: 'Googly Deception', value: 95, benchmark: 60 },
        { label: 'Dot Ball Pressure', value: 94, benchmark: 63 },
        { label: 'Middle Overs Economy', value: 91, benchmark: 62 },
        { label: 'Pressure Index (WPA)', value: 91, benchmark: 65 },
        { label: 'Bounce & Skid Impact', value: 93, benchmark: 57 }
      ],
      recentHighlights: [
        {
          match: 'UP vs Mumbai',
          tournament: 'SMAT 2024 Group Stage',
          performance: '3/18 (4 overs) dismissed Rahane & Dube',
          context: 'Choked the chase from 70/1 in 8 overs to 124 all out.'
        },
        {
          match: 'UP vs Hyderabad',
          tournament: 'Domestic T20 Series',
          performance: '4/21 (4 overs) with 16 dot balls',
          context: 'Turned match with 3 wickets in span of 7 deliveries.'
        }
      ]
    }
  },
  {
    id: 'rr-scout-05',
    rank: 5,
    name: 'Ashutosh Sharma',
    age: 26,
    role: 'Middle-Order Finisher',
    domesticTeam: 'Railways / MP',
    battingStyle: 'Right-Hand Bat',
    matchesPlayed: 34,
    runsOrWickets: '860 Runs',
    strikeRateOrEconomy: 181.6,
    boundaryPercentage: 76.2,
    deathPowerplayStat: 'Death SR: 228.4',
    clutchPressureRating: 94.2,
    winProbabilityAdded: 0.31,
    dotBallPressureRatio: 22.8,
    recommendedMaxBid: 4.50,
    basePrice: 0.30,
    primaryGapCovered: 'Finisher & Death Power',
    scoutingReport: {
      analystSummary: 'A certified miracle worker under extreme leverage situations. Holds the Indian record for fastest domestic T20 fifty (11 balls). Demonstrated unparalleled composure in high-pressure IPL chases. Hits high-pace 145 kph yorkers into the upper decks via extraordinary wrist whip.',
      technicalStrengths: [
        'Incredible pickup sweep and paddle-scoop against 140+ pace',
        'Top 1% strike rate in overs 18-20 across all domestic batsmen (228.4 SR)',
        'Extremely calm pulse in 15+ RRR scenarios',
        'High boundary conversion off good length balls'
      ],
      areasOfDevelopment: [
        'Can be tied down by wide outside-off stump slower balls',
        'Needs to avoid premeditating the scoop before ball release'
      ],
      rajasthanRoyalsFit: 'Gives RR the ultimate late-order insurance policy. Allows top order to play completely unfazed by fear of collapse.',
      projectedRole: 'Clutch Death Finisher & Chase Specialist',
      scoutRating: 9.5,
      metricsRadar: [
        { label: 'Death Overs SR', value: 98, benchmark: 66 },
        { label: 'Leverage / Chase Rating', value: 97, benchmark: 65 },
        { label: 'Boundary Frequency', value: 96, benchmark: 62 },
        { label: '360 Ramp & Scoop', value: 93, benchmark: 55 },
        { label: 'Dot Ball Suppression', value: 85, benchmark: 60 }
      ],
      recentHighlights: [
        {
          match: 'Railways vs Arunachal',
          tournament: 'Syed Mushtaq Ali Trophy',
          performance: '53 (12 balls) - Fastest fifty by an Indian (11 balls)',
          context: 'Came in at 15th over and lifted total past 240.'
        },
        {
          match: 'PBKS vs MI (IPL Matchup Study)',
          tournament: 'High Pressure Chase Review',
          performance: '61 (28 balls) almost stole game from 77/6',
          context: 'Leverage index peaked at 9.4; swept Bumrah 145 kph yorker for six.'
        }
      ]
    }
  },
  {
    id: 'rr-scout-06',
    rank: 6,
    name: 'Angkrish Raghuvanshi',
    age: 20,
    role: 'Top-Order Batter',
    domesticTeam: 'Mumbai',
    battingStyle: 'Right-Hand Bat',
    bowlingStyle: 'Slow Left-Arm Orthodox',
    matchesPlayed: 22,
    runsOrWickets: '620 Runs',
    strikeRateOrEconomy: 156.4,
    boundaryPercentage: 66.8,
    deathPowerplayStat: 'PP SR: 164.2',
    clutchPressureRating: 88.9,
    winProbabilityAdded: 0.21,
    dotBallPressureRatio: 26.5,
    recommendedMaxBid: 3.40,
    basePrice: 0.30,
    primaryGapCovered: 'Middle-Order Anchor/Rotator',
    scoutingReport: {
      analystSummary: 'Classically trained Mumbai batter with immense maturity and contemporary T20 stroke play. Possesses immaculate balance at the crease, brilliant footwork against quality spin, and the ability to find gaps effortlessly during middle-overs consolidation.',
      technicalStrengths: [
        'Classical high-elbow stroke play combined with reverse ramps',
        'Outstanding strike rotation against finger spin (only 22% dots vs spin)',
        'Versatility to bat anywhere from #1 to #4 without disruption',
        'Sound defensive technique when facing fresh Dukes/Kookaburra swing'
      ],
      areasOfDevelopment: [
        'Raw muscle power on slow sluggish wickets when timing fails',
        'Needs to add 10-15 meters of carry on boundary clearing hits'
      ],
      rajasthanRoyalsFit: 'Slotting him at #3 or #4 provides tactical flexibility, allowing Samson and Jurel to be deployed as dynamic pinch floaters based on match phase.',
      projectedRole: 'Top-Order Stroke Maker & Innings Constructor',
      scoutRating: 8.9,
      metricsRadar: [
        { label: 'Spin Footwork & SR', value: 92, benchmark: 64 },
        { label: 'Innings Adaptability', value: 90, benchmark: 60 },
        { label: 'Technical Soundness', value: 94, benchmark: 68 },
        { label: 'Pressure Index (WPA)', value: 89, benchmark: 65 },
        { label: 'Dot Ball Suppression', value: 88, benchmark: 60 }
      ],
      recentHighlights: [
        {
          match: 'Mumbai vs Baroda',
          tournament: 'SMAT Knockouts',
          performance: '74 (41 balls) guiding tricky chase',
          context: 'Built 110-run stand after Mumbai lost two quick wickets in powerplay.'
        },
        {
          match: 'India U19 / Emerging Trials',
          tournament: 'BCCI Talent Series',
          performance: '278 runs in 5 matches at 154 SR',
          context: 'Finished as tournament top run-scorer with 3 half-centuries.'
        }
      ]
    }
  },
  {
    id: 'rr-scout-07',
    rank: 7,
    name: 'Digvesh Rathi',
    age: 23,
    role: 'Pace Bowler',
    domesticTeam: 'Haryana / DPL',
    battingStyle: 'Right-Hand Bat',
    bowlingStyle: 'Right-Arm Fast (142+ kph)',
    matchesPlayed: 19,
    runsOrWickets: '31 Wickets',
    strikeRateOrEconomy: 7.28,
    boundaryPercentage: 13.9,
    deathPowerplayStat: 'PP Econ: 6.10',
    clutchPressureRating: 89.4,
    winProbabilityAdded: 0.22,
    dotBallPressureRatio: 54.1,
    recommendedMaxBid: 2.80,
    basePrice: 0.20,
    primaryGapCovered: 'Domestic Death Pacer',
    scoutingReport: {
      analystSummary: 'Express genuine quick who consistently touches 142-144 kph. Extracts awkward steep bounce from good lengths and possesses a lethal nip-backer that targets right-handers stumps. Economical in powerplay and generates high false-shot percentages.',
      technicalStrengths: [
        'Genuine pace (>142 kph) with upright seam presentation',
        'Superb powerplay control: 54.1% dot ball percentage',
        'Brisk bouncer that rushes batter on pull shot',
        'Terrific aggression and athletic boundary fielder'
      ],
      areasOfDevelopment: [
        'Consistency of death over wide line targets under dew conditions',
        'Can concede extra extras (wides) when searching for extra swing'
      ],
      rajasthanRoyalsFit: 'Gives RR the raw Indian pace firepower to shock oppositions, working alongside bowling coach Shane Bond to turn him into a marquee enforcer.',
      projectedRole: 'High-Pace Hit-the-Deck Enforcer',
      scoutRating: 8.9,
      metricsRadar: [
        { label: 'Raw Pace & Bounce', value: 96, benchmark: 60 },
        { label: 'Powerplay Economy', value: 92, benchmark: 63 },
        { label: 'Dot Ball Pressure', value: 94, benchmark: 63 },
        { label: 'Pressure Index (WPA)', value: 89, benchmark: 65 },
        { label: 'Wicket Strike Rate', value: 88, benchmark: 61 }
      ],
      recentHighlights: [
        {
          match: 'Haryana vs Bengal',
          tournament: 'Syed Mushtaq Ali Group Stage',
          performance: '3/16 (4 overs) dismantled top order',
          context: 'Took 2 wickets in the second over of the innings bowling 143 kph.'
        },
        {
          match: 'DPL Invitational',
          tournament: 'North Zone T20',
          performance: '4/22 including match-winning 20th over',
          context: 'Conceded only 3 runs in the final over with 2 bowled dismissals.'
        }
      ]
    }
  },
  {
    id: 'rr-scout-08',
    rank: 8,
    name: 'Musheer Khan',
    age: 20,
    role: 'All-Rounder',
    domesticTeam: 'Mumbai',
    battingStyle: 'Right-Hand Bat',
    bowlingStyle: 'Slow Left-Arm Orthodox',
    matchesPlayed: 20,
    runsOrWickets: '590 Runs / 19 Wkts',
    strikeRateOrEconomy: 142.5,
    boundaryPercentage: 61.4,
    deathPowerplayStat: 'Econ: 6.95 / SR: 142.5',
    clutchPressureRating: 92.1,
    winProbabilityAdded: 0.27,
    dotBallPressureRatio: 28.2,
    recommendedMaxBid: 3.60,
    basePrice: 0.30,
    primaryGapCovered: 'Middle-Order Anchor/Rotator',
    scoutingReport: {
      analystSummary: 'Fierce competitor with proven pedigree in tournament finals. Possesses rock-solid technique under crisis and crafty, accurate slow left-arm spin that chokes run-rates. Winner mindset with huge emotional resilience and hunger for high-stakes moments.',
      technicalStrengths: [
        'Steely determination in crisis matches; thrives under extreme scrutiny',
        'Excellent bat control against quality seam bowling on spicy wickets',
        'Stump-to-stump left-arm darts giving <7.0 RPO in middle overs',
        'Outstanding tactical awareness and match situation reading'
      ],
      areasOfDevelopment: [
        'Accelerating strike rate beyond 170 in death overs',
        'Power-hitting range on off-side against full wide deliveries'
      ],
      rajasthanRoyalsFit: 'Provides genuine all-round balance. Can bat #6 or #7 and bowl 2-3 tight overs, easing overseas all-rounder reliance.',
      projectedRole: 'Crisis Anchor & Tactical Multi-Tool All-Rounder',
      scoutRating: 9.2,
      metricsRadar: [
        { label: 'Big-Match Temperament', value: 97, benchmark: 65 },
        { label: 'All-Round Utility', value: 91, benchmark: 60 },
        { label: 'Bowling Economy', value: 89, benchmark: 62 },
        { label: 'Pressure Index (WPA)', value: 92, benchmark: 65 },
        { label: 'Innings Construction', value: 94, benchmark: 66 }
      ],
      recentHighlights: [
        {
          match: 'Mumbai vs Vidarbha',
          tournament: 'Ranji Trophy Final',
          performance: '136 (256 balls) & 2 wickets in final',
          context: 'Rescued Mumbai from 34/2 to secure title under immense pressure.'
        },
        {
          match: 'India U19 vs New Zealand U19',
          tournament: 'ICC U19 World Cup',
          performance: '131 (126 balls) & 2/10 (3.1 overs)',
          context: 'Dominated match completely from start to finish.'
        }
      ]
    }
  },
  {
    id: 'rr-scout-09',
    rank: 9,
    name: 'Kumar Kushagra',
    age: 21,
    role: 'Wicketkeeper-Batter',
    domesticTeam: 'Jharkhand',
    battingStyle: 'Right-Hand Bat',
    matchesPlayed: 25,
    runsOrWickets: '610 Runs',
    strikeRateOrEconomy: 162.8,
    boundaryPercentage: 67.5,
    deathPowerplayStat: 'Death SR: 194.2',
    clutchPressureRating: 87.8,
    winProbabilityAdded: 0.19,
    dotBallPressureRatio: 25.1,
    recommendedMaxBid: 2.60,
    basePrice: 0.20,
    primaryGapCovered: 'Dynamic Wicketkeeper',
    scoutingReport: {
      analystSummary: 'Dynamic wicketkeeper-batter from MS Dhoni school of hard hitting in Jharkhand. Renowned for monstrous pull shots and clean bat swing against fast bowling. Capable of batting anywhere between #4 and #7 and taking games deep with tactical calculated risk.',
      technicalStrengths: [
        'Lightning fast hands behind the stumps (sub 0.15s stumping reflex)',
        'Devastating pull shot off back foot against 140+ pace',
        'High boundary rate in overs 16-20 (194.2 SR at death)',
        'Very quick between wickets pushing extra runs'
      ],
      areasOfDevelopment: [
        'Spin defense during first 10 balls against sharp turning leg breaks',
        'Patience against disciplined wide yorker lines'
      ],
      rajasthanRoyalsFit: 'Provides elite backup and rotation for Sanju Samson behind the stumps, plus dynamic lower middle order firepower.',
      projectedRole: 'Finisher Wicketkeeper & Middle-Order Spark',
      scoutRating: 8.8,
      metricsRadar: [
        { label: 'Death Overs SR', value: 91, benchmark: 66 },
        { label: 'Glovework Reflexes', value: 94, benchmark: 65 },
        { label: 'Backfoot Pull Power', value: 93, benchmark: 60 },
        { label: 'Pressure Index (WPA)', value: 88, benchmark: 65 },
        { label: 'Running Between Wickets', value: 90, benchmark: 62 }
      ],
      recentHighlights: [
        {
          match: 'Jharkhand vs Maharashtra',
          tournament: 'Vijay Hazare Trophy',
          performance: '67 (37 balls) chasing 355 runs',
          context: 'Smashed 5 sixes to guide improbable chase to victory.'
        },
        {
          match: 'East Zone Trials',
          tournament: 'Deodhar Trophy Selection',
          performance: '98* (52 balls) batting at #6',
          context: 'Took team from 145/5 in 30 overs to 320/6.'
        }
      ]
    }
  },
  {
    id: 'rr-scout-10',
    rank: 10,
    name: 'Manav Suthar',
    age: 23,
    role: 'Finger Spinner',
    domesticTeam: 'Rajasthan (Home Grown)',
    battingStyle: 'Left-Hand Bat',
    bowlingStyle: 'Slow Left-Arm Orthodox',
    matchesPlayed: 26,
    runsOrWickets: '38 Wickets',
    strikeRateOrEconomy: 6.92,
    boundaryPercentage: 11.5,
    deathPowerplayStat: 'Middle Econ: 6.45',
    clutchPressureRating: 88.5,
    winProbabilityAdded: 0.20,
    dotBallPressureRatio: 56.4,
    recommendedMaxBid: 2.40,
    basePrice: 0.20,
    primaryGapCovered: 'Mystery Wrist Spinner',
    scoutingReport: {
      analystSummary: 'Homegrown Rajasthan talent who understands the Sawai Mansingh Stadium surface better than anyone. Tall left-arm spinner who gets natural drift and steep overspin. Capable of bowling in powerplay and holding down one end with remarkable economy.',
      technicalStrengths: [
        'Unmatched familiarity with Sawai Mansingh Stadium pitch nuances',
        'Extraordinary dot-ball consistency: 56.4% dots in middle overs',
        'Arm ball skids on quickly under lights causing bowled and LBW dismissals',
        'Handy lower order left-handed batting capability'
      ],
      areasOfDevelopment: [
        'Tends to bowl too short when batsmen step out aggressively',
        'Needs to develop a slower floater to deceive advancing batters'
      ],
      rajasthanRoyalsFit: 'Locally grown hero who immediately connects with the Jaipur fan base while filling the crucial domestic left-arm spin role.',
      projectedRole: 'Home Ground Weapon & Defensive Inning Stifler',
      scoutRating: 8.8,
      metricsRadar: [
        { label: 'Home Track Expertise', value: 98, benchmark: 55 },
        { label: 'Dot Ball Pressure', value: 96, benchmark: 63 },
        { label: 'Middle Overs Economy', value: 92, benchmark: 62 },
        { label: 'Pressure Index (WPA)', value: 88, benchmark: 65 },
        { label: 'Arm Ball Deception', value: 89, benchmark: 59 }
      ],
      recentHighlights: [
        {
          match: 'Rajasthan vs Gujarat',
          tournament: 'Ranji / SMAT Series at Jaipur',
          performance: '4/28 & 3/31 at Sawai Mansingh Stadium',
          context: 'Bowled Rajasthan to a historic home victory with relentless accuracy.'
        },
        {
          match: 'India A vs England Lions',
          tournament: 'First Class Tour',
          performance: '5/44 in second innings',
          context: 'Spun India A to victory on day 4 with unplayable drift.'
        }
      ]
    }
  }
];

export interface MethodologySection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  formulaLatex?: string;
  formulaExplanation: string[];
  keyParameters: { name: string; weight: string; role: string }[];
}

export const SCORING_METHODOLOGY: MethodologySection[] = [
  {
    id: 'pressure-index',
    title: '1. Dynamic Pressure Index (DPI) & Clutch Impact Formula',
    subtitle: 'Context-Weighted Ball-by-Ball Leverage Modeling',
    description: 'Raw strike rates and economies in domestic cricket are heavily skewed by mismatched opposition and low-stakes blowouts. The SupeRR Selector model computes a Dynamic Pressure Index (DPI) by weighting every ball by its Leverage Index (LI) and Win Probability Added (WPA).',
    formulaLatex: 'DPI_i = \\sum_{b=1}^{B_i} \\Big[ \\omega_{phase} \\cdot \\text{LI}(b) \\times \\big( \\Delta\\text{WPA}(b) + \\beta \\cdot \\text{BPA}(b) \\big) \\Big] \\times \\Psi_{opp}',
    formulaExplanation: [
      'LI(b): Match Leverage Index at ball b (measures how much the win probability hangs in the balance based on balls remaining, wickets in hand, and required run rate).',
      'ΔWPA(b): Net change in Win Probability Added resulting directly from the event (boundary, wicket, dot, single).',
      'ω_phase: Phase weight factor (Powerplay: 1.15x, Middle Overs: 0.95x, Death Overs 16-20: 1.45x).',
      'BPA(b): Boundary Pressure Added (bonus reward for hitting boundaries after 2 consecutive dot balls).',
      'Ψ_opp: Opponent Quality Matrix factor, normalizing player statistics against the tier and pace/spin quality of the domestic opposition.'
    ],
    keyParameters: [
      { name: 'Death Phase Multiplier', weight: '1.45x', role: 'Amplifies performance in overs 16-20' },
      { name: 'Leverage Cutoff (LI > 1.8)', weight: '2.00x', role: 'Rewards players performing when match hangs by a thread' },
      { name: 'Opponent Quality Matrix (OQM)', weight: '0.7x - 1.3x', role: 'Normalizes runs against elite state attacks vs plate teams' },
      { name: 'Bayesian Shrinkage Prior', weight: 'k = 25 balls', role: 'Dampens small-sample variance for debutants' }
    ]
  },
  {
    id: 'auction-valuation',
    title: '2. Auction Purse Optimization & Max Bid Algorithm',
    subtitle: 'Replacement-Level Valuation & Scarcity Curve',
    description: 'To prevent emotional overbidding at the auction table, our Valuation Engine computes a deterministic Recommended Max Bid (RMB) in ₹ Crores. It combines the player’s projected Win Contribution with the historical supply-demand curve for that specific tactical niche.',
    formulaLatex: '\\text{RMB}_i = \\text{BasePrice}_i + \\left( \\frac{\\text{DPI}_i - \\mu_{uncapped}}{\\sigma_{uncapped}} \\right) \\times \\Phi_{scarcity}(\\text{Role}_i) \\times \\text{BudgetFactor}_{RR}',
    formulaExplanation: [
      'BasePrice_i: Base registration bracket (₹ 0.20 Cr or ₹ 0.30 Cr).',
      'Standardized DPI: Z-score of the player’s Dynamic Pressure Index compared to the entire 842-player domestic pool.',
      'Φ_scarcity(Role): Supply elasticity multiplier. Roles with acute shortage in the auction pool (e.g., Domestic Death Pacers: 1.8x, Power Finisher: 1.6x) receive higher ceilings.',
      'BudgetFactor_RR: Target purse constraint ensuring RR never commits more than 48% of total purse to uncapped slots.'
    ],
    keyParameters: [
      { name: 'Death Pacer Scarcity Factor', weight: '1.85x', role: 'High premium due to severe scarcity of Indian fast bowlers' },
      { name: 'Spin Destroyer Scarcity Factor', weight: '1.60x', role: 'Premium for middle order batters who strike spin > 160' },
      { name: 'Top Order Anchor Deflator', weight: '0.85x', role: 'Discounted ceiling due to abundant domestic supply' },
      { name: 'Max Single-Player Cap', weight: '₹ 5.00 Cr', role: 'Hard risk mitigation stop-loss for any uncapped pick' }
    ]
  },
  {
    id: 'rr-home-pitch',
    title: '3. Sawai Mansingh Stadium Dimension & Pitch Alignment',
    subtitle: 'Jaipur Ground Matchup Optimization',
    description: 'A player who dominates at Chinnaswamy or Wankhede can struggle on the expansive dimensions of Sawai Mansingh Stadium in Jaipur (square boundaries 68-72m, straight boundaries 74m+). Our model filters for players whose shot dispersion maps and bowling arcs match Jaipur conditions.',
    formulaExplanation: [
      'Square Boundary Defensibility: Prioritizes fast bowlers with heavy lengths and cutters that induce mishits towards 70m square ropes.',
      'Middle-Overs Rotation: Batters must possess low dot-ball rates (<28%) to survive Jaipur larger outfields when boundaries dry up.',
      'Wrist Spin Gripping Factor: Pitch analysis shows SMS Stadium offers 3.2 degrees average lateral turn under lights with high bounce.'
    ],
    keyParameters: [
      { name: 'Square Boundary Distance', weight: '71m avg', role: 'Favors deep mid-wicket and square leg power hitters' },
      { name: 'Dew Factor Offset', weight: '-0.40 ER', role: 'Adjusts bowler metrics for second innings dew' },
      { name: 'Running Velocity Metric', weight: '1.20x', role: 'Rewards speed between wickets for two-run conversions' }
    ]
  }
];

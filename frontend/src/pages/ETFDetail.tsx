import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockETFs } from "@/data/mockETFs";
import { ArrowLeft, Bookmark, TrendingUp, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { saveActivity } from "@/utils/activityStorage";
import { useUser } from "@/contexts/UserContext";
import { getFundInfo, getFundNav, FundInfo, FundHolding } from "@/services/fundService";
import r1 from "@/assets/r1.jpeg";
import y1 from "@/assets/y1.jpeg";
import g1 from "@/assets/g1.jpeg";
import b1 from "@/assets/b1.jpeg";

const ETFDetail = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { role } = useUser();
	const [comment, setComment] = useState("");

	// Initial comments per ETF - varied across different people, some ETFs have no comments
	const initialComments: Record<
		string,
		Array<{
			id: string;
			author: string;
			content: string;
			isAdvisor?: boolean;
			profilePic?: string;
		}>
	> = {
		"1": [
			{
				id: "1",
				author: "Sarah Chen",
				content:
					"VOO is my core holding. Rock-solid performance and minimal fees make it perfect for long-term growth.",
				isAdvisor: true,
				profilePic: b1,
			},
			{
				id: "2",
				author: "Maya Rodriguez",
				content:
					"I've been invested in VOO for 5 years now. The consistency is impressive!",
				isAdvisor: false,
				profilePic: g1,
			},
			{
				id: "3",
				author: "Jessica Park",
				content: "Best starter ETF for anyone building wealth steadily.",
				isAdvisor: false,
				profilePic: y1,
			},
			{
				id: "4",
				author: "Elena Volkov",
				content:
					"Low expense ratio and broad diversification - can't go wrong with this one.",
				isAdvisor: true,
				profilePic: r1,
			},
		],
		"2": [
			{
				id: "1",
				author: "Priya Sharma",
				content:
					"QQQ has been fantastic for tech exposure. Higher volatility but worth it for the returns.",
				isAdvisor: true,
				profilePic: y1,
			},
			{
				id: "2",
				author: "Nina Torres",
				content: "Love this for my growth portfolio. Tech isn't going anywhere!",
				isAdvisor: false,
				profilePic: b1,
			},
			{
				id: "3",
				author: "Aisha Johnson",
				content: "Been riding the tech wave with QQQ. No regrets so far.",
				isAdvisor: false,
				profilePic: r1,
			},
		],
		"3": [
			{
				id: "1",
				author: "Laura Kim",
				content:
					"Perfect for the conservative portion of my portfolio. Bonds provide stability when stocks get choppy.",
				isAdvisor: true,
				profilePic: g1,
			},
			{
				id: "2",
				author: "Olivia Martinez",
				content: "Not exciting but that's the point. This is my safety net.",
				isAdvisor: false,
				profilePic: b1,
			},
		],
		"4": [
			{
				id: "1",
				author: "Rachel Goldstein",
				content:
					"ARKK is wild! High risk but Cathie Wood's picks have been interesting to follow.",
				isAdvisor: false,
				profilePic: r1,
			},
			{
				id: "2",
				author: "Sophia Anderson",
				content:
					"Only put in what you can afford to lose. This is definitely not for the faint of heart.",
				isAdvisor: true,
				profilePic: y1,
			},
			{
				id: "3",
				author: "Diana Chang",
				content:
					"Innovation comes with volatility. I keep this as a small portion of my portfolio.",
				isAdvisor: false,
				profilePic: g1,
			},
			{
				id: "4",
				author: "Hannah Lee",
				content: "Exciting but unpredictable. Watch this one closely if you invest.",
				isAdvisor: false,
				profilePic: b1,
			},
		],
		"5": [
			{
				id: "1",
				author: "Victoria Wright",
				content:
					"VTI gives you the entire U.S. stock market. Ultimate diversification in one fund.",
				isAdvisor: true,
				profilePic: b1,
			},
			{
				id: "2",
				author: "Natasha Ivanova",
				content:
					"I split my portfolio between VTI and international. Simple and effective.",
				isAdvisor: false,
				profilePic: r1,
			},
			{
				id: "3",
				author: "Grace Williams",
				content:
					"Can't beat the expense ratio and coverage. This is set-it-and-forget-it investing.",
				isAdvisor: false,
				profilePic: y1,
			},
		],
		"6": [
			{
				id: "1",
				author: "Zara Ahmed",
				content: "SPY is the OG S&P 500 ETF. Super liquid and reliable.",
				isAdvisor: false,
				profilePic: g1,
			},
		],
		"7": [
			{
				id: "1",
				author: "Megan Foster",
				content: "SCHD is my dividend machine. Quality companies with consistent payouts.",
				isAdvisor: true,
				profilePic: r1,
			},
			{
				id: "2",
				author: "Isabelle Dubois",
				content: "Great for income investors. The dividend growth is impressive.",
				isAdvisor: false,
				profilePic: b1,
			},
			{
				id: "3",
				author: "Carmen Silva",
				content: "This is how I fund my side expenses without touching my principal.",
				isAdvisor: false,
				profilePic: y1,
			},
			{
				id: "4",
				author: "Leah Cohen",
				content: "Love the focus on dividend aristocrats. Rock-solid companies here.",
				isAdvisor: true,
				profilePic: g1,
			},
		],
		// ETF "8" (TQQQ) intentionally has no comments - too risky for most people to comment on
	};

	const [comments, setComments] = useState<
		Array<{
			id: string;
			author: string;
			content: string;
			isAdvisor?: boolean;
			profilePic?: string;
		}>
	>(initialComments[id || ""] || []);
	const [fundInfo, setFundInfo] = useState<FundInfo | null>(null);
	const [loadingFund, setLoadingFund] = useState(false);

	const etf = mockETFs.find((e) => e.id === id);

	// Fetch real fund data when component mounts - get more historical data for charts
	useEffect(() => {
		if (etf?.ticker) {
			setLoadingFund(true);
			console.log(`[ETFDetail] Fetching live data for ${etf.ticker}...`);
			// Fetch comprehensive fund info with extended historical data
			Promise.all([
				getFundInfo(etf.ticker).catch(err => {
					console.error(`[ETFDetail] Error fetching fund info:`, err);
					return { error: err.message, ticker: etf.ticker };
				}),
				getFundNav(etf.ticker, 90).catch(err => {
					console.error(`[ETFDetail] Error fetching NAV:`, err);
					return [];
				})
			])
				.then(([fundData, navData]) => {
					console.log(`[ETFDetail] Fund data received:`, fundData);
					console.log(`[ETFDetail] NAV data points:`, navData.length);
					
					// Merge the extended historical NAV data into fund info
					if (navData && navData.length > 0) {
						fundData.historicalNav = navData;
					}
					
					// Always set fundInfo, even if there's an error, so we can show error messages
					setFundInfo(fundData);
				})
				.catch((error) => {
					console.error("[ETFDetail] Error loading fund data:", error);
					setFundInfo({ 
						error: error.message || "Failed to load fund data",
						ticker: etf.ticker,
						historicalNav: [],
						holdings: [],
						nav: null,
						totalReturn: null,
						lastUpdated: null
					});
				})
				.finally(() => {
					setLoadingFund(false);
				});
		}
	}, [etf?.ticker]);

	if (!etf) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center space-y-4">
					<h1 className="text-2xl font-bold">ETF Not Found</h1>
					<Button onClick={() => navigate("/invest")}>Back to Invest</Button>
				</div>
			</div>
		);
	}

	const handleAddComment = () => {
		if (comment.trim()) {
			// Randomly assign a profile picture
			const profilePics = [r1, y1, g1, b1];
			const randomPic = profilePics[Math.floor(Math.random() * profilePics.length)];

			const newComment = {
				id: Date.now().toString(),
				author: "You",
				content: comment,
				isAdvisor: role === "advisor",
				profilePic: randomPic,
			};

			setComments([...comments, newComment]);

			// Save to user's activity history
			saveActivity({
				type: "comment",
				content: comment,
				etf: etf.ticker,
			});

			setComment("");
		}
	};

	// Sort comments to prioritize advisor comments
	const sortedComments = [...comments].sort((a, b) => {
		if (a.isAdvisor && !b.isAdvisor) return -1;
		if (!a.isAdvisor && b.isAdvisor) return 1;
		return 0;
	});

	const personalityColor = etf.personalityMatch.includes("Long-Term")
		? "hsl(var(--long-term))"
		: etf.personalityMatch.includes("Short-Term")
		? "hsl(var(--short-term))"
		: etf.personalityMatch.includes("Low Risk")
		? "hsl(var(--low-risk))"
		: "hsl(var(--high-risk))";

	return (
		<div className="min-h-screen md:pl-20 pb-20 md:pb-8">
			<Navigation />

			<div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
				<Button variant="ghost" onClick={() => navigate("/invest")} className="gap-2">
					<ArrowLeft className="w-4 h-4" />
					Back
				</Button>

				<Card
					className="p-8 space-y-6 shadow-elevated animate-slide-up"
					style={{ borderTop: `4px solid ${personalityColor}` }}
				>
					<div className="flex items-start justify-between">
						<div className="space-y-2">
							<div className="flex items-center gap-3">
								<h1 className="text-4xl font-bold">{etf.ticker}</h1>
								<TrendingUp className="w-6 h-6 text-muted-foreground" />
							</div>
							<p className="text-xl text-muted-foreground">
								{fundInfo?.name || etf.name}
							</p>
							{fundInfo?.nav && (
								<p className="text-lg font-semibold" style={{ color: personalityColor }}>
									NAV: ${fundInfo.nav.toFixed(2)}
									{fundInfo.totalReturn && ` | Return: ${fundInfo.totalReturn.toFixed(2)}`}
								</p>
							)}
						</div>
						<Button variant="outline" size="icon" className="spring-press">
							<Bookmark className="w-4 h-4" />
						</Button>
					</div>

					<div className="space-y-4">
						{/* Real Fund Data from Morningstar */}
						{loadingFund && (
							<div className="flex items-center gap-2 text-muted-foreground">
								<Loader2 className="w-4 h-4 animate-spin" />
								<span>Loading live fund data...</span>
							</div>
						)}

						{/* Description - use real data if available, otherwise fallback */}
						<div>
							<h3 className="font-semibold mb-2">Description</h3>
							<p className="text-muted-foreground">
								{fundInfo?.description || etf.description}
							</p>
						</div>

						{/* Live Fund Data - NAV and Total Return */}
						{fundInfo && !fundInfo.error && fundInfo.nav && (
							<div className="grid grid-cols-2 gap-4 border-t pt-4">
								<div>
									<h3 className="font-semibold mb-2">Current NAV</h3>
									<p className="text-2xl font-bold">${fundInfo.nav.toFixed(2)}</p>
									{fundInfo.lastUpdated && (
										<p className="text-xs text-muted-foreground mt-1">
											Updated: {fundInfo.lastUpdated}
										</p>
									)}
								</div>
								{fundInfo.totalReturn && (
									<div>
										<h3 className="font-semibold mb-2">Total Return</h3>
										<p className="text-2xl font-bold">{fundInfo.totalReturn.toFixed(2)}</p>
									</div>
								)}
							</div>
						)}

						{/* Top Holdings - Real Data */}
						{fundInfo && !fundInfo.error && fundInfo.holdings && fundInfo.holdings.length > 0 && (
							<div className="border-t pt-4">
								<h3 className="font-semibold mb-3">Top Holdings</h3>
								<div className="space-y-2">
									{fundInfo.holdings.slice(0, 5).map((holding: FundHolding, index: number) => (
										<div key={index} className="flex justify-between items-center p-2 bg-muted/30 rounded">
											<div>
												<p className="font-medium">{holding.ticker || holding.securityName}</p>
												<p className="text-sm text-muted-foreground">
													{holding.securityName || holding.ticker}
												</p>
											</div>
											<p className="font-semibold">
												{typeof holding.weighting === 'number' 
													? `${holding.weighting.toFixed(2)}%`
													: holding.weighting}
											</p>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Expense Ratio and Risk - show real data if available, otherwise fallback */}
						<div className="grid grid-cols-2 gap-4 border-t pt-4">
							<div>
								<h3 className="font-semibold mb-2">Expense Ratio</h3>
								<p className="text-2xl font-bold">
									{fundInfo?.expenseRatio !== undefined && fundInfo.expenseRatio !== null
										? `${fundInfo.expenseRatio}%` 
										: `${etf.expenseRatio}%`}
								</p>
							</div>
							<div>
								<h3 className="font-semibold mb-2">Risk Level</h3>
								<Badge
									style={{ backgroundColor: personalityColor }}
									className="text-white"
								>
									{etf.personalityMatch[1] || "Medium"}
								</Badge>
							</div>
						</div>

						{/* Show error message if data fetch failed */}
						{fundInfo?.error && !loadingFund && (
							<div className="text-sm text-muted-foreground border-t pt-4">
								<p>⚠️ Live fund data unavailable. Showing static information.</p>
								<p className="text-xs mt-1">Error: {fundInfo.error}</p>
							</div>
						)}

						<div>
							<h3 className="font-semibold mb-2">
								{fundInfo?.historicalNav && fundInfo.historicalNav.length > 0 
									? "Performance Chart (Live Data)" 
									: "Performance Chart"}
							</h3>
							<div className="h-32 flex items-end gap-1">
								{fundInfo?.historicalNav && fundInfo.historicalNav.length > 0 ? (
									// Use real historical NAV data - show all available data points
									fundInfo.historicalNav.map((nav, index) => {
										const maxNav = Math.max(...fundInfo.historicalNav.map(n => n.nav));
										const minNav = Math.min(...fundInfo.historicalNav.map(n => n.nav));
										const height = maxNav > minNav 
											? ((nav.nav - minNav) / (maxNav - minNav)) * 100 
											: 50;
										return (
											<div
												key={index}
												className="flex-1 rounded-t transition-all hover:opacity-80 cursor-pointer"
												style={{
													height: `${height}%`,
													backgroundColor: personalityColor,
												}}
												title={`NAV: $${nav.nav.toFixed(2)} | Total Return: ${nav.totalReturn.toFixed(2)} | Date: ${nav.date}`}
											/>
										);
									})
								) : (
									// Fallback to hardcoded data if live data unavailable
									etf.chartData?.map((value, index) => (
										<div
											key={index}
											className="flex-1 rounded-t transition-all hover:opacity-80"
											style={{
												height: `${(value / 200) * 100}%`,
												backgroundColor: personalityColor,
											}}
										/>
									))
								)}
							</div>
							{fundInfo?.historicalNav && fundInfo.historicalNav.length > 0 ? (
								<p className="text-xs text-muted-foreground mt-2">
									Live data: {fundInfo.historicalNav.length} data points from {fundInfo.historicalNav[0]?.date} to {fundInfo.historicalNav[fundInfo.historicalNav.length - 1]?.date}
								</p>
							) : (
								<p className="text-xs text-muted-foreground mt-2">
									Using sample data. Live data unavailable.
								</p>
							)}
						</div>

						<div>
							<h3 className="font-semibold mb-2">Why it fits your personality</h3>
							<div className="flex flex-wrap gap-2">
								{etf.personalityMatch.map((match) => (
									<Badge
										key={match}
										style={{ backgroundColor: personalityColor }}
										className="text-white"
									>
										{match}
									</Badge>
								))}
							</div>
							<p className="text-sm text-muted-foreground mt-2">
								This ETF aligns with your financial personality traits, making it a
								suitable match for your investment goals and risk tolerance.
							</p>
						</div>
					</div>
				</Card>

				<Card className="p-6 space-y-4 shadow-card animate-fade-in">
					<h3 className="text-xl font-bold">Comments</h3>

					<div className="space-y-4">
						{sortedComments.map((c) => (
							<div key={c.id} className="flex gap-3">
								<Avatar className="w-10 h-10">
									{c.profilePic && (
										<AvatarImage src={c.profilePic} alt={c.author} />
									)}
									<AvatarFallback>{c.author[0]}</AvatarFallback>
								</Avatar>
								<div className="flex-1 space-y-1">
									<div className="flex items-center gap-2">
										<p className="font-semibold text-sm">{c.author}</p>
										{c.isAdvisor && (
											<Badge
												variant="secondary"
												className="text-xs px-2 py-0 h-5"
											>
												Advisor
											</Badge>
										)}
									</div>
									<p className="text-sm text-muted-foreground">{c.content}</p>
								</div>
							</div>
						))}
					</div>

					<div className="flex gap-2">
						<Input
							placeholder="Add a comment..."
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
						/>
						<Button onClick={handleAddComment} className="spring-press">
							Post
						</Button>
					</div>
				</Card>
			</div>
		</div>
	);
};

export default ETFDetail;

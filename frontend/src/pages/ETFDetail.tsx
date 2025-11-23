import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockETFs } from "@/data/mockETFs";
import { ArrowLeft, Bookmark, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { saveActivity } from "@/utils/activityStorage";
import { useUser } from "@/contexts/UserContext";
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

	const etf = mockETFs.find((e) => e.id === id);

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
							<p className="text-xl text-muted-foreground">{etf.name}</p>
						</div>
						<Button variant="outline" size="icon" className="spring-press">
							<Bookmark className="w-4 h-4" />
						</Button>
					</div>

					<div className="space-y-4">
						<div>
							<h3 className="font-semibold mb-2">Description</h3>
							<p className="text-muted-foreground">{etf.description}</p>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<h3 className="font-semibold mb-2">Expense Ratio</h3>
								<p className="text-2xl font-bold">{etf.expenseRatio}%</p>
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

						<div>
							<h3 className="font-semibold mb-2">5-Year Performance</h3>
							<div className="h-32 flex items-end gap-1">
								{etf.chartData?.map((value, index) => (
									<div
										key={index}
										className="flex-1 rounded-t transition-all hover:opacity-80"
										style={{
											height: `${(value / 200) * 100}%`,
											backgroundColor: personalityColor,
										}}
									/>
								))}
							</div>
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

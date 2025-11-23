import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Star, MessageCircle } from "lucide-react";
import ETFCard from "@/components/ETFCard";
import { mockETFs } from "@/data/mockETFs";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Invest = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [newComment, setNewComment] = useState<Record<string, string>>({});
	const [friendReviews, setFriendReviews] = useState([
		{
			id: "1",
			user: "Sarah Chen",
			personality: "SP",
			personalityColor: "hsl(var(--long-term))",
			isAdvisor: true,
			etf: "VOO",
			etfName: "Vanguard S&P 500",
			rating: 5,
			review: "Excellent long-term investment with low fees. Perfect for building wealth steadily over time.",
			timestamp: "1d",
			comments: [
				{
					id: "c1",
					author: "Maya Rodriguez",
					content: "Thanks for the tip!",
					isAdvisor: false,
				},
			],
		},
		{
			id: "2",
			user: "Alexandra Kim",
			personality: "RC",
			personalityColor: "hsl(var(--high-risk))",
			isAdvisor: false,
			etf: "ARKK",
			etfName: "ARK Innovation ETF",
			rating: 4,
			review: "High risk but exciting potential. The innovation focus is really interesting.",
			timestamp: "2d",
			comments: [],
		},
		{
			id: "3",
			user: "Jordan Williams",
			personality: "DC",
			personalityColor: "hsl(var(--low-risk))",
			isAdvisor: true,
			etf: "SCHD",
			etfName: "Schwab US Dividend Equity",
			rating: 5,
			review: "Great dividend ETF for income investors. Consistent returns and reliable payouts.",
			timestamp: "3d",
			comments: [
				{
					id: "c2",
					author: "Emma Taylor",
					content: "I've been considering this one!",
					isAdvisor: false,
				},
			],
		},
		{
			id: "4",
			user: "Priya Sharma",
			personality: "SI",
			personalityColor: "hsl(var(--primary))",
			isAdvisor: false,
			etf: "VTI",
			etfName: "Vanguard Total Stock Market",
			rating: 5,
			review: "Love the simplicity and broad diversification. Easy to understand and perfect for beginners!",
			timestamp: "4d",
			comments: [
				{
					id: "c3",
					author: "Nicole Zhang",
					content: "This is exactly what I was looking for!",
					isAdvisor: false,
				},
			],
		},
		{
			id: "5",
			user: "Aisha Patel",
			personality: "RA",
			personalityColor: "hsl(var(--high-risk))",
			isAdvisor: true,
			etf: "QQQ",
			etfName: "Invesco QQQ Trust",
			rating: 4,
			review: "Tech-heavy portfolio with strong growth potential. Great for clients who can handle volatility.",
			timestamp: "5d",
			comments: [],
		},
		{
			id: "6",
			user: "Isabella Martinez",
			personality: "SP",
			personalityColor: "hsl(var(--long-term))",
			isAdvisor: false,
			etf: "BND",
			etfName: "Vanguard Total Bond Market",
			rating: 4,
			review: "Solid choice for the conservative portion of my portfolio. Helps me sleep well at night!",
			timestamp: "6d",
			comments: [
				{
					id: "c4",
					author: "Olivia Chen",
					content: "Been adding this to my portfolio too",
					isAdvisor: false,
				},
				{
					id: "c5",
					author: "Sarah Chen",
					content: "Great balance strategy!",
					isAdvisor: true,
				},
			],
		},
		{
			id: "7",
			user: "Fatima Hassan",
			personality: "DI",
			personalityColor: "hsl(var(--low-risk))",
			isAdvisor: false,
			etf: "VIG",
			etfName: "Vanguard Dividend Appreciation",
			rating: 5,
			review: "Consistent dividend growth and low complexity. Perfect fit for my investment style.",
			timestamp: "1w",
			comments: [],
		},
	]);
	const navigate = useNavigate();

	const filteredETFs = mockETFs.filter(
		(etf) =>
			etf.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
			etf.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleAddComment = (reviewId: string) => {
		const comment = newComment[reviewId]?.trim();
		if (!comment) return;

		setFriendReviews(
			friendReviews.map((review) => {
				if (review.id === reviewId) {
					return {
						...review,
						comments: [
							...review.comments,
							{
								id: `c${Date.now()}`,
								author: "You",
								content: comment,
								isAdvisor: false,
							},
						],
					};
				}
				return review;
			})
		);

		setNewComment({ ...newComment, [reviewId]: "" });
	};

	const renderStars = (rating: number) => {
		return [...Array(5)].map((_, i) => (
			<Star
				key={i}
				className={`w-4 h-4 ${
					i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
				}`}
			/>
		));
	};

	return (
		<div className="min-h-screen md:pl-20 pb-20 md:pb-8">
			<Navigation />

			<div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
				<div className="space-y-4 animate-slide-up">
					<h1 className="text-3xl font-bold">Invest</h1>

					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
						<Input
							placeholder="Search ETFs by ticker or name..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10 h-12 rounded-full shadow-soft"
						/>
					</div>
				</div>

				<Tabs defaultValue="world" className="space-y-6">
					<TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
						<TabsTrigger value="world">World</TabsTrigger>
						<TabsTrigger value="friends">Friends</TabsTrigger>
					</TabsList>

					<TabsContent value="world" className="space-y-4 animate-fade-in">
						<div className="grid gap-4 md:grid-cols-2">
							{filteredETFs.map((etf) => (
								<ETFCard
									key={etf.id}
									etf={etf}
									onClick={() => navigate(`/etf/${etf.id}`)}
								/>
							))}
						</div>
					</TabsContent>

					<TabsContent value="friends" className="space-y-4 animate-fade-in">
						{friendReviews.map((review) => (
							<Card
								key={review.id}
								className="p-6 space-y-4 shadow-card"
								style={{ borderTop: `4px solid ${review.personalityColor}` }}
							>
								{/* Header */}
								<div className="flex items-start gap-3">
									<Avatar className="w-10 h-10">
										<AvatarFallback>{review.user[0]}</AvatarFallback>
									</Avatar>
									<div className="flex-1">
										<div className="flex items-center gap-2">
											<span className="font-semibold">{review.user}</span>
											{review.isAdvisor && (
												<Badge
													variant="secondary"
													className="text-xs px-2 py-0 h-5"
												>
													Advisor
												</Badge>
											)}
											<span className="text-sm text-muted-foreground">
												• {review.timestamp}
											</span>
										</div>
										<p className="text-sm text-muted-foreground">
											reviewed{" "}
											<span className="font-semibold text-foreground">
												{review.etfName}
											</span>
										</p>
									</div>
								</div>

								{/* Review Content */}
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<div className="flex">{renderStars(review.rating)}</div>
										<Badge
											variant="outline"
											className="cursor-pointer hover:bg-accent"
											onClick={() =>
												navigate(
													`/etf/${
														mockETFs.find(
															(e) => e.ticker === review.etf
														)?.id
													}`
												)
											}
										>
											{review.etf}
										</Badge>
									</div>
									<p className="text-sm">{review.review}</p>
								</div>

								{/* Comments Section */}
								{review.comments.length > 0 && (
									<div className="border-t pt-4 space-y-3">
										{review.comments.map((comment) => (
											<div key={comment.id} className="flex gap-2 text-sm">
												<Avatar className="w-7 h-7">
													<AvatarFallback className="text-xs">
														{comment.author[0]}
													</AvatarFallback>
												</Avatar>
												<div className="flex-1">
													<div className="flex items-center gap-2">
														<span className="font-semibold">
															{comment.author}
														</span>
														{comment.isAdvisor && (
															<Badge
																variant="secondary"
																className="text-xs px-1.5 py-0 h-4"
															>
																Advisor
															</Badge>
														)}
													</div>
													<p className="text-muted-foreground">
														{comment.content}
													</p>
												</div>
											</div>
										))}
									</div>
								)}

								{/* Add Comment */}
								<div className="flex gap-2 pt-2">
									<Input
										placeholder="Add a comment..."
										value={newComment[review.id] || ""}
										onChange={(e) =>
											setNewComment({
												...newComment,
												[review.id]: e.target.value,
											})
										}
										onKeyDown={(e) =>
											e.key === "Enter" && handleAddComment(review.id)
										}
										className="text-sm"
									/>
									<Button
										size="sm"
										onClick={() => handleAddComment(review.id)}
										className="spring-press"
									>
										<MessageCircle className="w-4 h-4" />
									</Button>
								</div>
							</Card>
						))}
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default Invest;

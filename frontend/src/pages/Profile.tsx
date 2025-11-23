import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useUser } from "@/contexts/UserContext";
import Navigation from "@/components/Navigation";
import { TrendingUp, Users, Pencil } from "lucide-react";

const Profile = () => {
	const navigate = useNavigate();
	const { personalityType, role } = useUser();
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [name, setName] = useState(() => {
		return localStorage.getItem("profileName") || "Your Name";
	});
	const [pronouns, setPronouns] = useState(() => {
		return localStorage.getItem("profilePronouns") || "they/them";
	});
	const [bio, setBio] = useState(() => {
		return (
			localStorage.getItem("profileBio") ||
			"Building wealth through thoughtful, personality-driven investment strategies."
		);
	});
	const [profilePic, setProfilePic] = useState<string | null>(() => {
		return localStorage.getItem("profilePic") || null;
	});

	useEffect(() => {
		if (!personalityType) {
			navigate("/");
		}
	}, [personalityType, navigate]);

	const handleSave = () => {
		localStorage.setItem("profileName", name);
		localStorage.setItem("profilePronouns", pronouns);
		localStorage.setItem("profileBio", bio);
		if (profilePic) {
			localStorage.setItem("profilePic", profilePic);
		}
		setIsEditOpen(false);
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setProfilePic(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	if (!personalityType) {
		return null;
	}

	const mockActivities = [
		{ id: "1", type: "comment", content: "Great ETF for long-term growth!", etf: "VOO" },
		{ id: "2", type: "comment", content: "Interesting risk profile", etf: "ARKK" },
		{ id: "3", type: "comment", content: "Perfect for my portfolio", etf: "SCHD" },
	];

	return (
		<div className="min-h-screen md:pl-20 pb-20 md:pb-8">
			<Navigation />

			<div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
				<Card className="p-8 text-center space-y-6 shadow-elevated animate-slide-up">
					<div className="relative">
						<Avatar className="w-32 h-32 mx-auto">
							{profilePic && <AvatarImage src={profilePic} alt="Profile" />}
							<AvatarFallback className="text-4xl">
								{role === "investor" ? "I" : "A"}
							</AvatarFallback>
						</Avatar>
						<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
							<DialogTrigger asChild>
								<Button
									size="icon"
									variant="outline"
									className="absolute top-0 right-1/2 translate-x-[80px] rounded-full"
								>
									<Pencil className="w-4 h-4" />
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>Edit Profile</DialogTitle>
									<DialogDescription>
										Make changes to your profile here. Click save when you're
										done.
									</DialogDescription>
								</DialogHeader>
								<div className="grid gap-4 py-4">
									<div className="grid gap-2">
										<Label htmlFor="picture">Profile Picture</Label>
										<Input
											id="picture"
											type="file"
											accept="image/*"
											onChange={handleImageUpload}
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="name">Name</Label>
										<Input
											id="name"
											value={name}
											onChange={(e) => setName(e.target.value)}
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="pronouns">Pronouns</Label>
										<Input
											id="pronouns"
											value={pronouns}
											onChange={(e) => setPronouns(e.target.value)}
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="bio">Bio</Label>
										<Input
											id="bio"
											value={bio}
											onChange={(e) => setBio(e.target.value)}
										/>
									</div>
								</div>
								<DialogFooter>
									<Button type="submit" onClick={handleSave}>
										Save changes
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>

					<div className="space-y-2">
						<h1 className="text-3xl font-bold">{name}</h1>
						<p className="text-muted-foreground">{pronouns}</p>
						<Badge variant="outline" className="gap-1">
							{role === "advisor" ? (
								<>
									<Users className="w-3 h-3" />
									Financial Advisor
								</>
							) : (
								<>
									<TrendingUp className="w-3 h-3" />
									Investor
								</>
							)}
						</Badge>
					</div>

					<p className="text-muted-foreground max-w-md mx-auto">{bio}</p>

					<div
						className="inline-block px-8 py-4 rounded-full font-bold text-3xl"
						style={{
							backgroundColor: personalityType.color,
							color: "white",
						}}
					>
						{personalityType.code}
					</div>

					<div>
						<p className="font-semibold text-xl">{personalityType.name}</p>
						<p className="text-muted-foreground mt-2">{personalityType.description}</p>
					</div>
				</Card>

				<div className="space-y-4">
					<h2 className="text-2xl font-bold">Financial Traits</h2>
					<div className="flex flex-wrap gap-2">
						<Badge
							className="text-sm"
							style={{ backgroundColor: "hsl(var(--long-term))" }}
						>
							#LongTerm
						</Badge>
						<Badge
							className="text-sm"
							style={{ backgroundColor: "hsl(var(--low-risk))" }}
						>
							#LowRisk
						</Badge>
						<Badge
							className="text-sm"
							style={{ backgroundColor: "hsl(var(--primary))" }}
						>
							#Simple
						</Badge>
						<Badge
							className="text-sm"
							style={{ backgroundColor: "hsl(var(--low-risk))" }}
						>
							#Consistent
						</Badge>
					</div>
				</div>

				<div className="space-y-4">
					<h2 className="text-2xl font-bold">Recent Activity</h2>
					<div className="grid gap-4 md:grid-cols-3">
						{mockActivities.map((activity) => (
							<Card key={activity.id} className="p-4 space-y-2 shadow-card">
								<Badge variant="outline" className="text-xs">
									{activity.etf}
								</Badge>
								<p className="text-sm">{activity.content}</p>
							</Card>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;

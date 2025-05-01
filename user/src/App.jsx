import { Flex, Text, Button } from "@radix-ui/themes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationMenuDemo from "./components/NavBar/NavigationMenuDemo";
import Navbar from "./components/NavBar/Navbar";
import EventSearch from "./components/Homepage/EventSearch";
import TrendingEvents from "./components/Homepage/TrendingEvents";
import Footer from "./components/Footer/Footer";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import FavoritePage from "./components/Auth/FavoritePage";
import EnterPlace from "./components/Auth/EnterPlace";
import AccountSettings from "./components/AccountSetting/AccountSettings";

// Layout component to wrap pages with common elements
function Layout({ children }) {
	return (
		<Flex direction="column" gap="2">
			<Navbar />
			{children}
			<Footer />
		</Flex>
	);
}

// Auth Layout component (without Navbar and Footer)
function AuthLayout({ children }) {
	return (
		<Flex direction="column" gap="2">
			{children}
		</Flex>
	);
}

// Home page component
function Home() {
	const trendingEvents = [
		{ name: 'Event One', category: 'Music' },
		{ name: 'Event Two', category: 'Sport', isLabel: true, label: 'Trending' },
		{ name: 'Event Three', category: 'Family' },
		{ name: 'Event Four', category: 'Theatre', isLabel: true, label: 'Almost Sold Out' },
		{ name: 'Event Three', category: 'Family' },
		{ name: 'Event Four', category: 'Theatre', isLabel: true, label: 'Almost Sold Out' },
		{ name: 'Event Three', category: 'Family' },
	];

	const topArtists = [
		{ name: 'Artist One', category: 'Sport' },
		{ name: 'Artist Two', category: 'Music' },
		{ name: 'Artist Three', category: 'Comedy' },
		{ name: 'Artist Four', category: 'Festival' },
		{ name: 'Artist Three', category: 'Comedy' },
		{ name: 'Artist Four', category: 'Festival' },
		{ name: 'Artist Four', category: 'Festival' },
	];

	return (
		<>
			<EventSearch />
			<TrendingEvents title="Trending Events" type="events" data={trendingEvents} />
			<TrendingEvents title="Top Artists/ Organiser" type="artists" data={topArtists} />
		</>
	);
}

// Placeholder components for other pages
function Events() {
	return <Text>Events Page</Text>;
}

function Artists() {
	return <Text>Artists Page</Text>;
}

function Profile() {
	return <Text>Profile Page</Text>;
}

function NotFound() {
	return <Text>404 - Page Not Found</Text>;
}

export default function MyApp() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={
					<Layout>
						<Home />
					</Layout>
				} />
				<Route path="/events" element={
					<Layout>
						<Events />
					</Layout>
				} />
				<Route path="/artists" element={
					<Layout>
						<Artists />
					</Layout>
				} />
				<Route path="/profile" element={
					<Layout>
						<Profile />
					</Layout>
				} />
				<Route path="/login" element={
					<AuthLayout>
						<Login />
					</AuthLayout>
				} />
				<Route path="/signup" element={
					<AuthLayout>
						<Signup />
					</AuthLayout>
				} />
				<Route path="*" element={
					<Layout>
						<NotFound />
					</Layout>
				} />
				<Route path="/signup/favorite" element={
					<AuthLayout>
						<FavoritePage />
					</AuthLayout>
				} />
				<Route path="/signup/plac" element={
					<AuthLayout>
						<EnterPlace />
					</AuthLayout>
				} />
				<Route path="/account" element={
					<AuthLayout>
						<AccountSettings/>
					</AuthLayout>
				} />
				
			</Routes>
		</Router>
	);
}
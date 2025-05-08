import { Flex, Text, Button } from "@radix-ui/themes";
import "@fontsource/instrument-sans";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
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
import EventDetail from "./components/Homepage/EventDetail";
import EventsList from "./components/Homepage/EventsList";

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
	const [events, setEvents] = useState([]);
	const [formattedEvents, setFormattedEvents] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const apiEvents = await fetch('https://www.api.ticketexpert.me/api/events', {
					method: 'GET',
					credentials: 'include',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
					},
				});
				
				if (!apiEvents.ok) {
					throw new Error(`HTTP error! status: ${apiEvents.status}`);
				}
				
				const data = await apiEvents.json();
				const formatted = data.map(event => ({
					name: event.title,
					category: new Date(event.date).toLocaleString('en-US', {
						day: 'numeric',
						month: 'long', 
						year: 'numeric',
						hour: 'numeric',
						minute: 'numeric'
					}),
					type: event.type
				}));
				setEvents(data);
				setFormattedEvents(formatted);
			} catch (error) {
				console.error("Error fetching events:", error);
				alert(`Failed to load events: ${error.message}`);
			} finally {
				setLoading(false);
			}
		};

		fetchEvents();
	}, []); // Empty dependency array

	const topArtists = [
		{ name: 'ZZ Top', category: 'Music' },
		{ name: 'George Thorogood & The Destroyers', category: 'Music' },
		{ name: 'The Living End', category: 'Music' },
		{ name: 'The Ten Tenors', category: 'Classical' },
		{ name: 'Bernard Fanning', category: 'Folk Rock' },
		{ name: 'Paul Dempsey', category: 'Indie Rock' },
		{ name: 'Alpha Wolf', category: 'Metal' },
	];

	return (
		<>
			<EventSearch />
			{!loading && (
				<>
					<TrendingEvents title="Trending Events" type="events" data={formattedEvents} />
					<TrendingEvents title="Top Artists/ Organiser" type="artists" data={topArtists} />
				</>
			)}
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


//TESTING - Backend check, remove later
export default function MyApp() {
	const [backendStatus, setBackendStatus] = useState(null);

	useEffect(() => {
		const checkBackend = async () => {
			try {
				const response = await fetch('https://www.api.ticketexpert.me/status');
				if (response.ok) {
					setBackendStatus('up');
				} else if (response.status === 404) {
					setBackendStatus('down-404');
				} else {
					setBackendStatus('down');
				}
			} catch (error) {
				console.error('Error checking backend:', error);
				setBackendStatus('error');
			}
		};

		checkBackend();
	}, []); // Empty dependency array

	useEffect(() => {
		if (backendStatus === 'up') {
			alert('Backend is up!');
		} else if (backendStatus === 'down-404') {
			alert('Backend is not up! 404 error');
		} else if (backendStatus === 'down') {
			alert('Backend is not up!');
		}
	}, [backendStatus]); // Only show alert when backend status changes

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
						<EventsList />
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
				<Route path="/signup/place" element={
					<AuthLayout>
						<EnterPlace />
					</AuthLayout>
				} />
				<Route path="/account" element={
					<AuthLayout>
						<AccountSettings/>
					</AuthLayout>
				} />
				<Route path="/event/:id" element={
					<Layout>
						<EventDetail />
					</Layout>
				} />
			</Routes>
		</Router>
	);
}
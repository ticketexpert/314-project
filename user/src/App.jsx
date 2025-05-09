import { Flex, Text, Button } from "@radix-ui/themes";
import "@fontsource/instrument-sans";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
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
import CategoriesList from "./components/Homepage/CategoriesList";
import LocationsList from "./components/Homepage/LocationsList";
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
	const [formattedEvents, setFormattedEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [topLocations, setTopLocations] = useState([]);

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const response = await fetch('https://api.ticketexpert.me/api/events');
				if (!response.ok) {
					throw new Error('Failed to fetch events');
				}
				const data = await response.json();

				// Format events for EventCard component
				const formatted = data.map(event => ({
					name: event.title,
					category: event.category,
					type: 'events',
					image: event.image,
					description: event.description,
					fromDateTime: event.fromDateTime,
					toDateTime: event.toDateTime,
					venue: event.venue,
					region: event.region,
					pricing: event.pricing,
					tags: event.tags
				}));

				// Get unique locations with event counts
				const locationMap = new Map();
				data.forEach(event => {
					if (event.region) {
						const count = locationMap.get(event.region) || 0;
						locationMap.set(event.region, count + 1);
					}
				});

				// Format locations for EventCard component
				const locations = Array.from(locationMap.entries())
					.map(([region, count]) => ({
						name: region,
						category: `${count} Events`,
						type: 'artists',
						isLabel: true,
						label: region,
						image: data.find(e => e.region === region)?.image || ''
					}))
					.sort((a, b) => parseInt(b.category) - parseInt(a.category))
					.slice(0, 7);

				setFormattedEvents(formatted);
				setTopLocations(locations);
			} catch (error) {
				console.error("Error fetching events:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchEvents();
	}, []);

	return (
		<>
			<EventSearch />
			{!loading && (
				<>
					<TrendingEvents 
						title="Trending Events" 
						subtitle="Don't miss out on these popular events happening soon!" 
						type="events" 
						data={formattedEvents} 
					/>
					<TrendingEvents 
						title="Popular Places" 
						subtitle="Check out these popular places to visit!" 
						type="artists" 
						data={topLocations} 
					/>
				</>
			)}
		</>
	);
}

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
				<Route path="/categories" element={
					<Layout>
						<CategoriesList />
					</Layout>
				} />
				<Route path="/locations" element={
					<Layout>
						<LocationsList />
					</Layout>
				} />
			</Routes>
		</Router>
	);
}
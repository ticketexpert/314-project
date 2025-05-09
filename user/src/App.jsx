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
import LocationsList from "./components/Homepage/LocationsList";
import CategoriesList from "./components/Homepage/CategoriesList";
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
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				
				const data = await response.json();
				
				// Format events for display
				const formatted = data.map(event => ({
					name: event.title,
					category: event.category,
					type: 'events',
					image: event.image,
					description: event.description,
					dateRange: `${new Date(event.fromDateTime).toLocaleDateString()} - ${new Date(event.toDateTime).toLocaleDateString()}`,
					venue: event.venue,
					region: event.region,
					pricing: event.pricing,
					tags: event.tags
				}));

				// Get unique regions and their counts
				const regionCounts = data.reduce((acc, event) => {
					acc[event.region] = (acc[event.region] || 0) + 1;
					return acc;
				}, {});

				// Convert to array and sort by count
				const uniqueLocations = Object.entries(regionCounts)
					.map(([name, count]) => ({
						name,
						category: `${count} Events`,
						type: 'artists',
						isLabel: true,
						label: getStateFromCity(name)
					}))
					.sort((a, b) => b.count - a.count)
					.slice(0, 7);

				setFormattedEvents(formatted);
				setTopLocations(locations);
			} catch (error) {
				console.error("Error fetching events:", error);
			} finally {
				setLoading(false);
			}
		};

		// Helper function to get state from city
		const getStateFromCity = (city) => {
			// Normalize city name to handle case sensitivity and extra spaces
			const normalizedCity = city.trim().toLowerCase();
			
			const cityToState = {
				'sydney': 'New South Wales',
				'melbourne': 'Victoria',
				'brisbane': 'Queensland',
				'perth': 'Western Australia',
				'adelaide': 'South Australia',
				'hobart': 'Tasmania',
				'darwin': 'Northern Territory',
				'canberra': 'Australian Capital Territory',
				'gold coast': 'Queensland',
				'newcastle': 'New South Wales',
				'wollongong': 'New South Wales',
				'geelong': 'Victoria',
				'townsville': 'Queensland',
				'cairns': 'Queensland',
				'toowoomba': 'Queensland',
				'ballarat': 'Victoria',
				'bendigo': 'Victoria',
				'albury': 'New South Wales',
				'maitland': 'New South Wales',
				'mackay': 'Queensland',
				'sunshine coast': 'Queensland',
				'newman': 'Western Australia',
				'port macquarie': 'New South Wales',
				'tamworth': 'New South Wales',
				'wagga wagga': 'New South Wales',
			};

			// Try to find an exact match first
			if (cityToState[normalizedCity]) {
				return cityToState[normalizedCity];
			}

			// If no exact match, try to find a partial match
			const matchingCity = Object.keys(cityToState).find(key => 
				normalizedCity.includes(key) || key.includes(normalizedCity)
			);

			return matchingCity ? cityToState[matchingCity] : 'Unknown';
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
				<Route path="locations" element={
					<Layout>
						<LocationsList />
					</Layout>
				} />
				<Route path="categories" element={
					<Layout>
						<CategoriesList />
					</Layout>
				} />
			</Routes>
		</Router>
	);
}
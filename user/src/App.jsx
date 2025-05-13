import { Flex, Text, Button } from "@radix-ui/themes";
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
import TicketBooking from "./components/Tickets/TicketBooking";
import Cart from "./components/Cart/Cart";
import Checkout from "./components/Checkout/Checkout";
import CheckoutSuccess from './components/Checkout/CheckoutSuccess';
import FallbackPage from './components/ErrorPage/fallBackPage';
import { CartProvider } from './context/CartContext';

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
					tags: event.tags,
					eventId: event.eventId
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
						label: getStateFromCity(name),
						region: name,
						image: getCityImage(name)
					}))
					.sort((a, b) => b.count - a.count)
					.slice(0, 7);

				setFormattedEvents(formatted);
				setTopLocations(uniqueLocations);
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

		// Helper function to get city image
		const getCityImage = (city) => {
			const cityImages = {
				'sydney': 'https://plus.unsplash.com/premium_photo-1697730198238-48ee2f2fe1b7?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
				'melbourne': 'https://images.unsplash.com/photo-1595434971780-79d5c20c5090?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
				'brisbane': 'https://plus.unsplash.com/premium_photo-1694475701659-444e11e512d9?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
				'perth': 'https://plus.unsplash.com/premium_photo-1697729743874-1d9d21ee467d?q=80&w=3125&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
				'adelaide': 'https://images.unsplash.com/photo-1595850344461-dcbec3a62f67?q=80&w=2439&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
				'hobart': 'https://unsplash.com/photos/an-aerial-view-of-a-city-at-night-RH2X12LMKic',
				'darwin': 'https://unsplash.com/photos/darwin-australia-skyline-1',
				'canberra': 'https://unsplash.com/photos/city-skyline-under-blue-sky-during-daytime-V_pvQ96focY',
				'gold coast': 'https://plus.unsplash.com/premium_photo-1694475704268-03c3965ac43e?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
				'newcastle': 'https://unsplash.com/photos/city-skyline-during-night-time-Rj148uGc3TA',
				'wollongong': 'https://unsplash.com/photos/a-body-of-water-with-a-waterfall-and-a-city-in-the-background-fm3bBo-KS7Q',
				'geelong': 'https://unsplash.com/photos/yXVyvkeanQI',
				'townsville': 'https://unsplash.com/photos/an-aerial-view-of-a-city-with-a-river-running-through-it-9l-dHOrhN-k',
				'cairns': 'https://unsplash.com/photos/grey-seashore-rock-with-view-of-city-skyline-during-night-time-CxMeYdo1hAg',
				'toowoomba': 'https://unsplash.com/photos/a-red-bridge-over-a-small-pond-in-a-park-rQRMISCM77E',
				'ballarat': 'https://unsplash.com/photos/ballarat-australia-skyline-1',
				'bendigo': 'https://unsplash.com/photos/bendigo-australia-skyline-1',
				'albury': 'https://unsplash.com/photos/albury-australia-skyline-1',
				'maitland': 'https://unsplash.com/photos/maitland-australia-skyline-1',
				'mackay': 'https://unsplash.com/photos/mackay-australia-skyline-1',
				'sunshine coast': 'https://unsplash.com/photos/sunshine-coast-australia-skyline-1',
				'newman': 'https://unsplash.com/photos/newman-australia-skyline-1',
				'port macquarie': 'https://unsplash.com/photos/port-macquarie-australia-skyline-1',
				'tamworth': 'https://unsplash.com/photos/tamworth-australia-skyline-1',
				'wagga wagga': 'https://unsplash.com/photos/wagga-wagga-australia-skyline-1',
			  }			  

			// Normalize city name to handle case sensitivity and extra spaces
			const normalizedCity = city.trim().toLowerCase();
			
			// Try to find an exact match first
			if (cityImages[normalizedCity]) {
				return cityImages[normalizedCity];
			}

			// If no exact match, try to find a partial match
			const matchingCity = Object.keys(cityImages).find(key => 
				normalizedCity.includes(key) || key.includes(normalizedCity)
			);

			return matchingCity ? cityImages[matchingCity] : 'https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=1000'; // Default image
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
				if (error.name === 'TypeError' && error.message.includes('CORS')) {
					setBackendStatus('cors-error');
				} else {
					setBackendStatus('error');
				}
			}
		};

		checkBackend();
	}, []); // Empty dependency array

	if (backendStatus === 'down-404') {
		return (
			<FallbackPage />
		);
	}

	if (backendStatus === 'down' || backendStatus === 'error') {
		return (
			<FallbackPage />
		);
	}

	if (backendStatus === 'cors-error') {
		return (
			<FallbackPage />
		);
	}

	// Show loading state while checking backend
	if (!backendStatus) {
		return (
			<Flex direction="column" align="center" justify="center" style={{ height: '100vh' }}>
				<Text size="5" weight="bold">Checking Backend Status...</Text>
			</Flex>
		);
	}

	return (
		<CartProvider>
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
					<Route path="/event/:id/tickets" element={
						<Layout>
							<TicketBooking />
						</Layout>
					} />
					<Route path="/cart" element={
						<Layout>
							<Cart />
						</Layout>
					} />
					<Route path="/checkout" element={
						<Layout>
							<Checkout />
						</Layout>
					} />
					<Route path="/checkout/success" element={
						<Layout>
							<CheckoutSuccess />
						</Layout>
					} />
				</Routes>
			</Router>
		</CartProvider>
	);
}
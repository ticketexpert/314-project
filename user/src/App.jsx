import { Flex, Text, Button } from "@radix-ui/themes";
import "@fontsource/instrument-sans";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
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
const trendingEvents = [
  { name: 'ZZ Top & Friends – Stuart Park', category: 'Music', isLabel: true, label: 'Almost Sold Out' },
  { name: 'The Ten Tenors – 30th Anniversary Tour', category: 'Music' },
  { name: 'Scenes from the Climate Era', category: 'Theatre', isLabel: true, label: 'Trending' },
  { name: 'Wollongong Chilli Festival', category: 'Family' },
  { name: 'Ride Wollongong – Festival of Cycling', category: 'Sport', isLabel: true, label: 'Trending' },
  { name: 'Live Baby Live – INXS Tribute', category: 'Music' },
  { name: 'Bernard Fanning & Paul Dempsey', category: 'Music', isLabel: true, label: 'Hot Pick' },
];

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


//TESTING - Backend check, remove later
export default function MyApp() {
	useEffect(() => {
		console.log('Checking backend status');
		fetch('https://www.api.ticketexpert.me/status')
			.then(response => {
				console.log('Response received:', response.status);
				if (response.ok) {
					alert('Backend is up!');
				} else {
					console.error('Bad Response from the backend for soem reason:', response.status);
				}
			})
			.catch(error => {
				console.error('Error checking backend:', error);
			});
	}, []);

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
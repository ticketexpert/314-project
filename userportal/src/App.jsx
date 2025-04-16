import { Flex, Text, Button} from "@radix-ui/themes";
import NavigationMenuDemo from "./components/NavBar/NavigationMenuDemo";
import Navbar from "./components/NavBar/Navbar";
import EventSearch from "./components/Homepage/EventSearch";
import TrendingEvents from "./components/Homepage/TrendingEvents";
import Footer from "./components/Footer/Footer";
export default function MyApp() {
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
		<Flex direction="column" gap="2">
      <Navbar />
      <EventSearch />
	  <TrendingEvents title="Trending Events" type="events" data={trendingEvents} />
      <TrendingEvents title="Top Artists/ Organiser" type="artists" data={topArtists} />
	  <Footer />
		</Flex>
	);
}
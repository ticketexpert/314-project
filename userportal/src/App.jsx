import { Flex, Text, Button} from "@radix-ui/themes";
import NavigationMenuDemo from "./components/NavBar/NavigationMenuDemo";
import Navbar from "./components/NavBar/Navbar";
import EventSearch from "./components/Homepage/EventSearch";
export default function MyApp() {
	return (
		<Flex direction="column" gap="2">
      <Navbar />
      <EventSearch />
		</Flex>
	);
}
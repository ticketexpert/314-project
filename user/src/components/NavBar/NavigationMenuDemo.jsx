import * as React from "react";
import { NavigationMenu } from "radix-ui";
import classNames from "classnames";
import { CaretDownIcon } from "@radix-ui/react-icons";
import "./styles.css";

const NavigationMenuDemo = () => {
	return (
		<NavigationMenu.Root className="NavigationMenuRoot">
			<NavigationMenu.List className="NavigationMenuList">
				<NavigationMenu.Item>
					<NavigationMenu.Trigger className="NavigationMenuTrigger">
						Sport <CaretDownIcon className="CaretDown" aria-hidden />
					</NavigationMenu.Trigger>
					<NavigationMenu.Content className="NavigationMenuContent">
						<ul className="List one">
							<li style={{ gridRow: "span 3" }}>
								<NavigationMenu.Link asChild>
									<a className="Callout" href="/">
										<div className="CalloutHeading">AFL</div>
										<p className="CalloutText">
                                        Update the newest The Australian Football League matches
										</p>
									</a>
								</NavigationMenu.Link>
							</li>

							<ListItem href="" title="Rugby League">
                                The National Rugby League is a professional rugby league competition in Oceania
							</ListItem>
							<ListItem href="" title="Footy">
							</ListItem>
							<ListItem href="" title="Horse Racing">
                                ANZAC Day Race Day - Now Available!
							</ListItem>
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<NavigationMenu.Trigger className="NavigationMenuTrigger">
						Music <CaretDownIcon className="CaretDown" aria-hidden />
					</NavigationMenu.Trigger>
					<NavigationMenu.Content className="NavigationMenuContent">
						<ul className="List two">
							<ListItem
								title="Concerts & Festivals"
								href=""
							>
								Attend epic concerts and immersive multi-day music festivals across all genres.
							</ListItem>
							<ListItem
								title="DJ & Club Nights"
								href=""
							>
								Dance the night away with live DJs and electric club vibes.
							</ListItem>
							<ListItem title="Indie & Local Bands" href="">
                                Discover rising stars and support your local music community.
							</ListItem>
							<ListItem
								title="Classical & Opera"
								href=""
							>
								Indulge in timeless orchestras, opera performances, and elegant musical showcases.
							</ListItem>
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
                <NavigationMenu.Item>
					<NavigationMenu.Trigger className="NavigationMenuTrigger">
						Family <CaretDownIcon className="CaretDown" aria-hidden />
					</NavigationMenu.Trigger>
					<NavigationMenu.Content className="NavigationMenuContent">
						<ul className="List one">
							<li style={{ gridRow: "span 3" }}>
								<NavigationMenu.Link asChild>
									<a className="Callout" href="/">
										<div className="CalloutHeading">Family Festivals</div>
										<p className="CalloutText">
                                        Enjoy carnival rides, live shows, and food at lively community events.
										</p>
									</a>
								</NavigationMenu.Link>
							</li>

							<ListItem href="" title="Outdoor Picnics & Nature Days">
                                Relax with your loved ones at beautiful outdoor family-friendly gatherings.
							</ListItem>
							<ListItem href="" title="Kids Shows & Workshops">
                                Fun and educational activities made just for kids of all ages.
							</ListItem>
							<ListItem href="" title="Educational Events">
                                Interactive exhibits, science fairs, and creative learning experiences for curious young minds.
							</ListItem>
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<NavigationMenu.Link
						className="NavigationMenuLink"
						href=""
					>
						More
					</NavigationMenu.Link>
				</NavigationMenu.Item>

				<NavigationMenu.Indicator className="NavigationMenuIndicator">
					<div className="Arrow" />
				</NavigationMenu.Indicator>
			</NavigationMenu.List>

			<div className="ViewportPosition">
				<NavigationMenu.Viewport className="NavigationMenuViewport" />
			</div>
		</NavigationMenu.Root>
	);
};

const ListItem = React.forwardRef(
	({ className, children, title, ...props }, forwardedRef) => (
		<li>
			<NavigationMenu.Link asChild>
				<a
					className={classNames("ListItemLink", className)}
					{...props}
					ref={forwardedRef}
				>
					<div className="ListItemHeading">{title}</div>
					<p className="ListItemText">{children}</p>
				</a>
			</NavigationMenu.Link>
		</li>
	),
);

export default NavigationMenuDemo;
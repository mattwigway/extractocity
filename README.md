# Make adding city entries to Extractotron effortless

Just type the city you want in the search field, select the proper
GeoNames entry, select a region, type in a slug and a name, drag a box
on the map using the control key (not shift - that's zoom), confirm
all the fields have been updated, and copy the line into cities.txt.

The name and slug are update using an onChange handler, so be aware
that they won't change until you defocus the text field.

If you just want to add to cities.txt without deploying this on your
server, check out [the hosted version](http://mattwigway.github.com/extractocity/citymaker.html).

Thanks to Mike Migurski for providing Extractotron in the first place.

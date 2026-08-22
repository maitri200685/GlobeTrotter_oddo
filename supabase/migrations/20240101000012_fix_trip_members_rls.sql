-- Fix infinite recursion in trip_members RLS policies
-- The old SELECT policy on trip_members queried trip_members again (self-referential = infinite loop)

-- Drop all existing trip_members policies
DROP POLICY IF EXISTS "Trip members viewable by trip participants or if public" ON trip_members;
DROP POLICY IF EXISTS "Only owners can manage trip members" ON trip_members;

-- Recreate without recursion:
-- SELECT: user sees their own membership row OR they own the trip OR trip is public
CREATE POLICY "Trip members viewable by owner or self" ON trip_members FOR SELECT
USING (
  auth.uid() = user_id
  OR EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_id AND trips.owner_id = auth.uid())
  OR EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_id AND trips.visibility = 'public')
);

-- INSERT: only trip owner can add members
CREATE POLICY "Only owners can insert trip members" ON trip_members FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_id AND trips.owner_id = auth.uid()));

-- UPDATE: only trip owner can update members
CREATE POLICY "Only owners can update trip members" ON trip_members FOR UPDATE
USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_id AND trips.owner_id = auth.uid()));

-- DELETE: only trip owner can remove members
CREATE POLICY "Only owners can delete trip members" ON trip_members FOR DELETE
USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_id AND trips.owner_id = auth.uid()));

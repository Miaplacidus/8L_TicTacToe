// HAL goes first
// A. Take the center square
//  Goal is to make a blocking T shape
//  OPP HAS TWO CHOICES
//    1. Take a corner square:
//      response: Finish the diagonal they are in.
//      opp: They can only win with an edge and a corner.
//      i. if an edge mark is taken, create the t-shape (such that there are two winning lines) AND WIN
//      ii. if a corner mark is taken, block via an edge, END IN A TIE
//    2. Take an edge square:
//      NB Taking an edge square means they must then take 2 corner squares to
//      win.
//      r. When they take the edge square, respond by taking either of the corners
//      furthest from their mark
//      opp: They can only then respond with a blocking corner, or an edge (which means
//      you win by finishing a diagonal)
//       r. Finish the blocking T, by taking a corner farthest from their previous move
//
// B. Take a corner square
//
//   OPP HAS TWO CHOICES
//    1. Take a center square
//        r. Take corner opposite to complete diagonal
//         opp: will take an edge or a corner. IF A CORNER
//         r. complete the triangle to win
//          IF AN EDGE: just block their moves
//
//    2. Take any other square
//     General goal is to make a triangle
//         r. Take a row or column that both contains your previous move and
//            doesn't contain any of your opponent's moves. Place a marker in its corner
//         opp: opponent must block your move or you win the game
//         r. Take a corner such that a triangle is created using a row or column
              without opp move
  //
//
//  HUMAN GOES FIRST
//  1. Opponent takes center
    //  r. mark a corner
    //  opp: they may complete the diagonal
    //  r. mark corners and block -- TIE
//  2. Opponent takes a corner
//    r. take the center, then edges and blocking -- TIE
3. Opponent takes an edge
  r. mark the center
  opp: they will try to get a win via the corners
  r. mark any corner at the intersection of their previous two moves.
  (if there is no intersection, mark a corner so as to complete the diagonal)

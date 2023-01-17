import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function Loading(props) {
  const position = props.position || "fixed";
  const bgColor = props.bgColor || "";
  const bgFilter = props.bgFilter || "";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        position: position,
        top: 0,
        left: 0,
        background: bgColor,
        zIndex: 9999,
        backdropFilter: bgFilter,
      }}
    >
      <CircularProgress />
    </Box>
  );
}

function BtnLoading(props) {
  const color = props.color || "";
  const h = props.h || 25;
  const w = props.w || 25;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 9999,
        background: "inherit",
        borderRadius: "inherit",
      }}
    >
      <CircularProgress
        style={{ color: color, height: h + "px", width: w + "px" }}
      />
    </Box>
  );
}

export { BtnLoading };

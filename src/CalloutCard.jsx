import react from 'react';
import { CardActions, CardHeader, Card, Button, CardContent, Paper } from '@mui/material';
import { AlignVerticalCenter } from '@mui/icons-material';
import { useTheme } from '@mui/styles';
export default function CalloutCard(props) {
  const { header, content, buttonText, buttonLink, key, sx } = props;
  const theme = useTheme();
  return (
    <>
      <Card
      sx={{
        borderRadius: 2,
        dropShadow: '0px 4px 8px rgba(0.5, 0.5)',
        height: 300,
          p: 1  ,
          "&:hover": {
            cursor: "pointer",
            "& .addIcon": {
              color: "purple"
            }
          }
        }}>
        <CardHeader title={header}>{header}</CardHeader>
        <CardContent>{content}</CardContent>
        <CardActions
          sx={{

            justifyContent: 'center',
          }}
        >
          <Button variant={'outlined'} href={buttonLink}>
            {buttonText}
          </Button>
        </CardActions>
      </Card>
    </>
  );
}
